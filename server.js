const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const guides = [
  {
    id: 1,
    name: "Ravi Kumar",
    city: "Hyderabad",
    language: "Telugu, English",
    price: 1200,
    rating: 4.8,
    specialty: "Heritage & city tours",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
  },
  {
    id: 2,
    name: "Ananya Sharma",
    city: "Warangal",
    language: "Telugu, Hindi, English",
    price: 1000,
    rating: 4.7,
    specialty: "History & temples",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800"
  },
  {
    id: 3,
    name: "Arjun Reddy",
    city: "Hyderabad",
    language: "Telugu, English, Hindi",
    price: 1500,
    rating: 4.9,
    specialty: "Food & culture walks",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"
  }
];

// Demo storage: data resets when the server restarts.
// A production project should use MongoDB or another persistent database.
const bookings = [];
app.get("/"(req,res)=>{
  res.sendFile(__dirname +"/index.html");
});
app.get("/api/guides", (req, res) => {
  const search = (req.query.search || "").toLowerCase().trim();
  const results = guides.filter((guide) =>
    [guide.name, guide.city, guide.language, guide.specialty]
      .join(" ").toLowerCase().includes(search)
  );
  res.json({ count: results.length, guides: results });
});

app.get("/api/guides/:id", (req, res) => {
  const guide = guides.find((item) => item.id === Number(req.params.id));
  if (!guide) return res.status(404).json({ message: "Guide not found" });
  res.json(guide);
});

app.post("/api/bookings", (req, res) => {
  const { customerName, email, guideId, date, guests } = req.body;

  if (!customerName || !email || !guideId || !date || !guests) {
    return res.status(400).json({
      message: "Please fill in all required booking fields."
    });
  }

  const guide = guides.find((item) => item.id === Number(guideId));
  if (!guide) {
    return res.status(404).json({ message: "Selected guide was not found." });
  }

  const booking = {
    id: bookings.length + 1001,
    customerName: String(customerName).trim(),
    email: String(email).trim(),
    guideId: guide.id,
    guideName: guide.name,
    date,
    guests: Number(guests),
    estimatedTotal: guide.price * Number(guests),
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);
  res.status(201).json({
    message: "Booking request submitted successfully!",
    booking
  });
});

app.get("/api/bookings", (_req, res) => {
  res.json({ count: bookings.length, bookings });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", project: "Tour Guide Booking Platform" });
});

app.listen(PORT, () => {
  console.log(`Tour Guide Booking Platform running at http://localhost:${PORT}`);
});
