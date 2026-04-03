# Payment Gateway — Frontend Simulation

## Preview

![Payment Gateway Screenshot](screenshot.png)

A modern, responsive payment gateway UI built with pure HTML, CSS, and vanilla JavaScript. No frameworks, no backend, no real payment API.

## Features

- Product/order summary with GST breakdown
- 3 payment methods: Credit/Debit Card, UPI, Net Banking
- Live card preview with network detection (Visa, Mastercard, Amex, RuPay)
- Full input validation with inline error messages
- UPI ID validation + dummy QR code
- Net Banking with bank selection chips
- Loading animation (2–3s) + Success/Failure result screen
- Animated SVG checkmark on success
- Dark mode toggle
- Fully responsive (mobile friendly)

## Project Structure

```
├── index.html   # Main HTML structure
├── style.css    # Styling, animations, dark mode
├── script.js    # Validation, tab switching, payment simulation
└── README.md
```

## How to Run

Just open `index.html` in any browser — no server or installation needed.

```bash
# Windows
cmd /c start index.html
```

## Payment Methods

| Method      | Validation                          |
|-------------|-------------------------------------|
| Card        | 16-digit number, MM/YY expiry, 3-digit CVV |
| UPI         | Must contain `@` (e.g. `name@upi`) |
| Net Banking | Select from 6 major Indian banks    |

## Tech Stack

- HTML5
- CSS3 (custom properties, animations, flexbox)
- Vanilla JavaScript (ES6+)
- Font Awesome 6 (icons)

## Notes

- This is a frontend-only simulation project
- No real payment is processed
- Payment success/failure is randomly simulated (80% success rate)
#
