#!/usr/bin/env python3
"""PrintSwift development-only shared SQLite API, Python stdlib, no internet required.

Not the native Tauri backend. Never use for real customer data or as a production
5-PC deployment without HTTPS, user roles, certificate/device onboarding, backups,
audit review, and hardware tests.
"""
from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from hmac import compare_digest
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
import json
import os
import sqlite3
import uuid

ROOT = Path(__file__).resolve().parent
STAGES = {"received", "design", "approval", "printing", "finishing", "ready", "delivered", "on_hold"}
UNITS = {"ft", "in", "cm", "m", "mm", "piece"}
COLS = "id,customer,phone,material,unit,width,height,qty,rate_cents,discount_cents,advance_cents,total_cents,balance_cents,due,priority,stage,created"

def database_path() -> Path:
    p = Path(os.environ.get("PRINTSWIFT_DEMO_DB", str(ROOT / ".devdata" / "orders.sqlite3")))
    p.parent.mkdir(parents=True, exist_ok=True)
    return p

def connection() -> sqlite3.Connection:
    db = sqlite3.connect(database_path(), timeout=10, isolation_level=None)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA busy_timeout=10000")
    db.execute("PRAGMA foreign_keys=ON")
    return db

def init_db() -> None:
    with connection() as db:
        db.execute("PRAGMA journal_mode=WAL")
        db.executescript("""CREATE TABLE IF NOT EXISTS orders(
            id TEXT PRIMARY KEY, customer TEXT NOT NULL, phone TEXT NOT NULL,
            material TEXT NOT NULL, unit TEXT NOT NULL,
            width TEXT NOT NULL, height TEXT NOT NULL, qty INTEGER NOT NULL CHECK(qty>0),
            rate_cents INTEGER NOT NULL CHECK(rate_cents>=0),
            discount_cents INTEGER NOT NULL CHECK(discount_cents>=0),
            advance_cents INTEGER NOT NULL CHECK(advance_cents>=0),
            total_cents INTEGER NOT NULL CHECK(total_cents>=0),
            balance_cents INTEGER NOT NULL CHECK(balance_cents>=0),
            due TEXT, priority TEXT NOT NULL, stage TEXT NOT NULL, created TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS production_events(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL REFERENCES orders(id),
            stage TEXT NOT NULL, event_at TEXT NOT NULL);
            CREATE INDEX IF NOT EXISTS idx_orders_due ON orders(due);
            CREATE INDEX IF NOT EXISTS idx_production_events ON production_events(order_id);""")

def amount(value: object, label: str) -> int:
    try:
        d = Decimal(str(value))
        if not d.is_finite() or d < 0 or d > Decimal("9999999999"):
            raise ValueError()
        return int((d * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    except (ValueError, TypeError, InvalidOperation) as e:
        raise ValueError(f"Invalid {label}") from e

def number(value: object, label: str) -> Decimal:
    try:
        d = Decimal(str(value))
        if not d.is_finite() or d <= 0 or d > Decimal("100000"):
            raise ValueError()
        return d
    except (ValueError, TypeError, InvalidOperation) as e:
        raise ValueError(f"Invalid {label}") from e

def order_data(o: dict) -> tuple:
    customer = str(o.get("customer", "")).strip()[:160] or "Walk-in"
    phone = str(o.get("phone", "")).strip()[:60]
    material = str(o.get("material", "")).strip()[:160]
    unit = str(o.get("unit", "ft"))
    if not material or unit not in UNITS:
        raise ValueError("Choose a valid material and unit")
    q = number(o.get("qty", 0), "quantity")
    if q != q.to_integral_value() or q > 100000:
        raise ValueError("Quantity must be a whole number")
    w = number(o.get("width", 0), "width") if unit != "piece" else Decimal("1")
    h = number(o.get("height", 0), "length") if unit != "piece" else Decimal("1")
    rate = amount(o.get("rate", 0), "rate")
    discount = amount(o.get("discount", 0), "discount")
    advance = amount(o.get("paid", 0), "advance")
    # Deterministic multiplication using integer minor units; decimals represent
    # the dimensions in the exact chosen unit, as in the user's existing print POS.
    line_cents = int((w * h * q * rate).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    if discount > line_cents:
        raise ValueError("Discount cannot exceed subtotal")
    total = line_cents - discount
    if advance > total:
        raise ValueError("Advance cannot exceed invoice total")
    due = o.get("due") or None
    if due:
        try:
            due_dt = datetime.fromisoformat(str(due).replace("Z", "+00:00"))
            if due_dt.tzinfo is None:
                raise ValueError()
            due = due_dt.isoformat()
        except (ValueError, TypeError):
            raise ValueError("Delivery time must include timezone")
    priority = str(o.get("priority", "normal"))
    if priority not in {"normal", "high", "rush"}:
        raise ValueError("Invalid priority")
    return (customer, phone, material, unit, str(w), str(h), int(q),
            rate, discount, advance, total, total - advance, due, priority)

def serialize(row: sqlite3.Row) -> dict:
    d = dict(row)
    for x in ("rate", "discount", "advance", "total", "balance"):
        d[x] = d.pop(x + "_cents") / 100
    d["width"] = float(d["width"])
    d["height"] = float(d["height"])
    d["paid"] = d["advance"]
    return d

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def send_json(self, status: int, data: object):
        blob = json.dumps(data, separators=(",", ":")).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(blob)))
        self.end_headers()
        self.wfile.write(blob)

    def authorized(self) -> bool:
        token = os.environ.get("PRINTSWIFT_DEMO_TOKEN", "")
        if not token:
            return self.client_address[0] in ("127.0.0.1", "::1")
        return compare_digest(self.headers.get("X-PrintSwift-Demo-Token", ""), token)

    def incoming(self) -> dict:
        n = int(self.headers.get("Content-Length", "0"))
        if not 0 < n <= 16384:
            raise ValueError("Invalid request size")
        data = json.loads(self.rfile.read(n))
        if not isinstance(data, dict):
            raise ValueError("Expected JSON object")
        return data

    def do_GET(self):
        path = urlparse(self.path).path
        if path.startswith("/api/"):
            if not self.authorized():
                return self.send_json(401, {"error": "Development token required"})
            if path == "/api/status":
                return self.send_json(200, {"mode": "shared-sqlite-development", "production": False})
            if path == "/api/orders":
                with connection() as db:
                    data = [serialize(x) for x in db.execute(f"SELECT {COLS} FROM orders ORDER BY created DESC LIMIT 1000")]
                return self.send_json(200, {"orders": data})
            return self.send_json(404, {"error": "Not found"})
        # Static content is a browser development preview, not a shop file server.
        return super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != "/api/orders":
            return self.send_json(404, {"error": "Not found"})
        if not self.authorized():
            return self.send_json(401, {"error": "Development token required"})
        try:
            data = order_data(self.incoming())
            order_id = "PS-" + uuid.uuid4().hex[:14].upper()
            now = datetime.now(timezone.utc).isoformat()
            with connection() as db:
                db.execute("BEGIN IMMEDIATE")
                db.execute("""INSERT INTO orders(id,customer,phone,material,unit,width,height,qty,
                rate_cents,discount_cents,advance_cents,total_cents,balance_cents,
                due,priority,stage,created) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                           (order_id, *data, "received", now))
                db.execute("INSERT INTO production_events(order_id,stage,event_at) VALUES(?,?,?)",
                           (order_id, "received", now))
                db.execute("COMMIT")
                row = db.execute(f"SELECT {COLS} FROM orders WHERE id=?", (order_id,)).fetchone()
            return self.send_json(201, {"order": serialize(row)})
        except (ValueError, json.JSONDecodeError) as e:
            return self.send_json(400, {"error": str(e)})
        except sqlite3.Error:
            return self.send_json(500, {"error": "Unable to save order"})

    def do_PATCH(self):
        path = urlparse(self.path).path
        if not path.startswith("/api/orders/") or not path.endswith("/stage"):
            return self.send_json(404, {"error": "Not found"})
        if not self.authorized():
            return self.send_json(401, {"error": "Development token required"})
        ident = path.split("/")[3]
        try:
            stage = self.incoming().get("stage")
            if stage not in STAGES:
                return self.send_json(400, {"error": "Invalid production stage"})
            now = datetime.now(timezone.utc).isoformat()
            with connection() as db:
                db.execute("BEGIN IMMEDIATE")
                cur = db.execute("UPDATE orders SET stage=? WHERE id=?", (stage, ident))
                if cur.rowcount != 1:
                    db.execute("ROLLBACK")
                    return self.send_json(404, {"error": "Order not found"})
                db.execute("INSERT INTO production_events(order_id,stage,event_at) VALUES(?,?,?)",
                           (ident, stage, now))
                db.execute("COMMIT")
            return self.send_json(200, {"ok": True, "stage": stage})
        except (ValueError, json.JSONDecodeError) as e:
            return self.send_json(400, {"error": str(e)})

if __name__ == "__main__":
    from argparse import ArgumentParser
    p = ArgumentParser()
    p.add_argument("--bind", default="127.0.0.1", help="Use 0.0.0.0 only behind private LAN / VPN, with a token")
    p.add_argument("--port", type=int, default=8000)
    args = p.parse_args()
    if args.bind not in ("127.0.0.1", "::1", "localhost") and not os.environ.get("PRINTSWIFT_DEMO_TOKEN"):
        p.error("A development token is required when listening outside localhost")
    init_db()
    print("PrintSwift development SQLite server at http://%s:%s/preview.html" % (args.bind,args.port))
    ThreadingHTTPServer((args.bind,args.port), Handler).serve_forever()
