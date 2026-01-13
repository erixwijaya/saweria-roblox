const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

let donations = [];
const MAX_DONATIONS = 50;

// Endpoint untuk menerima webhook dari Saweria
app.post("/webhook/saweria", (req, res) => {
  try {
    const { donor_name, message, amount } = req.body;

    if (!donor_name || !amount) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const donation = {
      id: Date.now().toString(),
      donor_name: donor_name || "Anonymous",
      message: message || "",
      amount: amount,
      timestamp: new Date().toISOString(),
      displayed: false,
    };

    donations.unshift(donation);

    if (donations.length > MAX_DONATIONS) {
      donations = donations.slice(0, MAX_DONATIONS);
    }

    console.log("New donation received:", donation);
    res.status(200).json({ success: true, donation });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk Roblox mengambil donasi terbaru
app.get("/api/donations/new", (req, res) => {
  try {
    const newDonations = donations.filter((d) => !d.displayed);
    res.json({ donations: newDonations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk menandai donasi sudah ditampilkan
app.post("/api/donations/mark-displayed", (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid data" });
    }

    donations.forEach((donation) => {
      if (ids.includes(donation.id)) {
        donation.displayed = true;
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk mendapatkan semua donasi
app.get("/api/donations/all", (req, res) => {
  try {
    res.json({ donations: donations });
  } catch (error) {
    console.error("Error fetching all donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    donations_count: donations.length,
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Saweria-Roblox Backend API",
    endpoints: {
      webhook: "POST /webhook/saweria",
      new_donations: "GET /api/donations/new",
      mark_displayed: "POST /api/donations/mark-displayed",
      all_donations: "GET /api/donations/all",
      health: "GET /health",
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
