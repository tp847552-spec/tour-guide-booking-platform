# Tour Guide Booking Platform

A beginner-friendly full-stack student project built with **Node.js, Express.js, HTML, CSS and JavaScript**.

## Features
- Responsive travel-themed home page
- Search local guides by name, city, language or specialty
- Guide cards with price, rating and profile image
- Booking form with input validation
- Booking API returns a booking reference, estimated total and status
- View all demo bookings through the API

## Requirements
- Node.js (LTS version recommended)
- npm (included with Node.js)
- A web browser

## Run the project
1. Extract the project ZIP.
2. Open the extracted `tour_guide_booking_project` folder in VS Code.
3. Open the terminal in that folder.
4. Run:

   ```bash
   npm install
   npm start
   ```

5. Open `http://localhost:3000` in your browser.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check whether server is running |
| GET | `/api/guides` | List all guides |
| GET | `/api/guides?search=Hyderabad` | Search guides |
| GET | `/api/guides/1` | Get one guide |
| POST | `/api/bookings` | Submit a booking |
| GET | `/api/bookings` | View demo bookings |

### Example booking input
```json
{
  "customerName": "Pavani",
  "email": "pavani@example.com",
  "guideId": 1,
  "date": "2026-11-15",
  "guests": 2
}
```

## Project structure
```text
tour_guide_booking_project/
├── server.js
├── package.json
├── README.md
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```

## Business logic
1. Browser requests guide data from `/api/guides`.
2. Express filters guide records using the search keyword.
3. The browser displays the returned JSON data as guide cards.
4. When the booking form is submitted, the server validates required fields.
5. The server checks that the selected guide exists.
6. The booking is saved in demo memory and a reference/status is returned.

## Important limitations
This is an educational prototype. Bookings are held in memory and disappear when the server restarts. It does not process real payments, provide production authentication, or verify actual guide availability. For a production version, add MongoDB persistence, authentication/authorization, stronger validation, secure environment variables, tests, and a trusted payment provider.

## References
- Node.js: https://nodejs.org/en/docs/
- Express: https://expressjs.com/
- MDN Web Docs: https://developer.mozilla.org/
- MongoDB documentation: https://www.mongodb.com/docs/
