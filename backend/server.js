const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const authMiddleware = require("./auth");
const Fundraiser = require("./models/Fundraiser");
const Donation = require("./models/Donations");
const { body, validationResult, param } = require("express-validator");
require("dotenv").config();

// Initialize Stripe with the secret key
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connects to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// A basic route to check if API is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Test the route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Registered users route with validation
app.post(
  "/api/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
  }
);

// route for logins
app.post(
  "/api/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create a token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  }
);

// Protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "This is a protected route. Only accessible with a valid token!",
    user: req.user,
  });
});

// CREATE a new fundraiser
app.post(
  "/api/fundraisers",
  authMiddleware,
  [
    body("title")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    body("description")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long"),
    body("goalAmount")
      .isFloat({ gt: 0 })
      .withMessage("Goal amount must be greater than 0"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, goalAmount } = req.body;

    try {
      const newFundraiser = new Fundraiser({
        title,
        description,
        goalAmount,
        creator: req.user.id, // Attach the user's ID if I decide to keep the creator field
      });
      await newFundraiser.save();
      res
        .status(201)
        .json({
          message: "Fundraiser created successfully!",
          fundraiser: newFundraiser,
        });
    } catch (error) {
      res.status(500).json({ message: "Error creating fundraiser", error });
    }
  }
);

// GET all fundraisers
app.get("/api/fundraisers", async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find();
    res.status(200).json(fundraisers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fundraisers", error });
  }
});

// GET 1 fundraiser by ID
app.get(
  "/api/fundraisers/:id",
  [param("id").isMongoId().withMessage("Invalid fundraiser ID")],
  async (req, res) => {
    try {
      const fundraiser = await Fundraiser.findById(req.params.id);
      if (!fundraiser) {
        return res.status(404).json({ message: "Fundraiser not found" });
      }
      res.status(200).json(fundraiser);
    } catch (error) {
      res.status(500).json({ message: "Error fetching fundraiser", error });
    }
  }
);

// UPDATE a fundraiser
app.put(
  "/api/fundraisers/:id",
  authMiddleware,
  [
    param("id").isMongoId().withMessage("Invalid fundraiser ID"),
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long"),
    body("goalAmount")
      .notEmpty()
      .withMessage("Goal amount is required")
      .isFloat({ gt: 0 })
      .withMessage("Goal amount must be greater than 0"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedFundraiser = await Fundraiser.findByIdAndUpdate(
        req.params.id,
        { title, description, goalAmount },
        { new: true } // Return the updated document
      );
      if (!updatedFundraiser) {
        return res.status(404).json({ message: "Fundraiser not found" });
      }
      res
        .status(200)
        .json({
          message: "Fundraiser updated successfully!",
          fundraiser: updatedFundraiser,
        });
    } catch (error) {
      res.status(500).json({ message: "Error updating fundraiser", error });
    }
  }
);

// DELETE a fundraiser
app.delete(
  "/api/fundraisers/:id",
  authMiddleware,
  [param("id").isMongoId().withMessage("Invalid fundraiser ID")],
  async (req, res) => {
    try {
      const deletedFundraiser = await Fundraiser.findByIdAndDelete(
        req.params.id
      );
      if (!deletedFundraiser) {
        return res.status(404).json({ message: "Fundraiser not found" });
      }
      res.status(200).json({ message: "Fundraiser deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting fundraiser", error });
    }
  }
);

// This endpoint will allow users to make a donation to a specific fundraiser:
app.post(
  "/api/donations",
  authMiddleware,
  [
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("donorName").notEmpty().withMessage("Donor name is required"),
    body("fundraiserId").isMongoId().withMessage("Invalid fundraiser ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, donorName, fundraiserId } = req.body;

    try {
      const fundraiser = await Fundraiser.findById(fundraiserId);
      if (!fundraiser) {
        return res.status(404).json({ message: "Fundraiser not found" });
      }

      const donation = new Donation({
        amount,
        donorName,
        fundraiser: fundraiserId,
      });

      // Save donation to database
      await donation.save();

      // Update fundraiser's currentAmount
      fundraiser.currentAmount += amount;
      await fundraiser.save();

      res.status(201).json({ message: "Donation successful", donation });
    } catch (error) {
      res.status(500).json({ message: "Error processing donation", error });
    }
  }
);

// Endpoint for handling Stripe payments
app.post(
  "/api/payments",
  authMiddleware,
  [body("amount").isNumeric().withMessage("Amount must be a number")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount } = req.body;

    try {
      // Convert amount to cents as Stripe works with the smallest currency unit
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });

      // Send the client secret to the frontend
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent", error });
    }
  }
);

// This will return all donations related to a specific fundraiser:
app.get(
  "/api/fundraisers/:fundraiserId/donations",
  authMiddleware,
  [
    // Validate fundraiserId as a valid MongoDB ObjectId
    param("fundraiserId").isMongoId().withMessage("Invalid fundraiser ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fundraiserId } = req.params;

    try {
      const donations = await Donation.find({
        fundraiser: fundraiserId,
      }).populate("fundraiser", "title");
      if (!donations.length) {
        return res
          .status(404)
          .json({ message: "No donations found for this fundraiser" });
      }

      res.status(200).json(donations);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving donations", error });
    }
  }
);

// This endpoint will return all donations
app.get("/api/donations", authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find().populate("fundraiser", "title");
    if (!donations.length) {
      return res.status(404).json({ message: "No donations found" });
    }
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving donations", error });
  }
});

// This route allows users to update a donation (if donor wants to increase their donation amount)
app.put(
  "/api/donations/:donationId",
  authMiddleware,
  [
    // Validate donationId as a valid MongoDB ObjectId
    param("donationId").isMongoId().withMessage("Invalid donation ID"),

    // Make amount required and validate it
    body("amount").isNumeric().withMessage("Amount must be a number"),

    // Make donorName required and validate it
    body("donorName")
      .isString()
      .withMessage("Donor name must be an alphabetical name"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { donationId } = req.params;
    const { amount, donorName } = req.body;

    try {
      const donation = await Donation.findById(donationId);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }

      // Update the donation details
      donation.amount = amount || donation.amount;
      donation.donorName = donorName || donation.donorName;

      await donation.save();
      res
        .status(200)
        .json({ message: "Donation updated successfully", donation });
    } catch (error) {
      res.status(500).json({ message: "Error updating donation", error });
    }
  }
);

// This endpoint allows users to delete a donation
app.delete(
  "/api/donations/:donationId",
  authMiddleware,
  [
    // Validate donationId as a valid MongoDB ObjectId
    param("donationId").isMongoId().withMessage("Invalid donation ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { donationId } = req.params;

    try {
      const donation = await Donation.findByIdAndDelete(donationId);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }

      // Updates the fundraiser's currentAmount after deleting
      const fundraiser = await Fundraiser.findById(donation.fundraiser);
      if (fundraiser) {
        fundraiser.currentAmount -= donation.amount;
        await fundraiser.save();
      }

      res.status(200).json({ message: "Donation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting donation", error });
    }
  }
);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});