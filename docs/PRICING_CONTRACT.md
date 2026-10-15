# POS pricing contract (development)

- Quantity must be a positive integer (maximum 100,000).
- Rate, discount and advance are Pakistani rupee amounts with at most two decimal places.
- Width and height are positive decimal dimensions with at most four decimal places.
- Piece pricing: quantity × rate.
- Measured printing pricing: width × height × quantity × rate, where rate is per square of the **selected** unit (feet, inches, centimetres, metres or millimetres). No implicit conversion is applied.
- Round the line subtotal once, half up, to integer paisa/cents; then subtract discount.
- Reject discount above subtotal, advance above total, negative amounts, non-finite values, exponent notation and values outside supported ranges.
- This contract describes calculation behavior, not FBR compliance.
