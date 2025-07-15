import express from "express";
import { connectDB } from "./data/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import router from "./routes/Hospital.js";
import routerr from "./routes/Visitor.js";

const app = express();

// 🔌 Connect to MongoDB
connectDB();

// ✅ Set up CORS for local and deployed frontend
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://healthcaremangementplatformbackend.onrender.com", // backend (optional)
  "https://health-care-mangement-platform-fron.vercel.app" // (Optional: add frontend domain when deployed)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or from allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

// Middleware to parse JSON & cookies
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(router);
app.use(routerr);

// Root route
app.get("/", (req, res) => {
  res.send("working");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
