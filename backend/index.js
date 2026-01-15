import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import path from "path";
import passport from "passport";
import { summarizeText, describeImage, analyzeFile } from "./gemini.js";
import keys from "./config/keys.js";

// Models & Services
import "./models/User.js";
import "./models/Summary.js";
import "./services/passport.js";

const app = express();

// Middleware
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [keys.cookieKey],
  })
);

// Polyfill for Passport 0.6+ compatibility with cookie-session
app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies
  })
);
app.use(express.json({ limit: "50mb" })); // Increase limit for images

mongoose.connect(keys.mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// ... (Auth Routes remain unchanged)

// API Routes
const Summary = mongoose.model("summaries");

app.post("/summarize", async (req, res) => {
  try {
    const summaryText = await summarizeText(req.body.text);

    // Save to DB if user is logged in
    if (req.user) {
      const summary = new Summary({
        _user: req.user.id,
        originalText: req.body.text,
        summaryText: summaryText,
      });
      await summary.save();
    }

    res.json({ summary: summaryText });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/api/describe", async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) return res.status(400).send({ error: "No image provided" });

    const description = await describeImage(image, mimeType);

    if (req.user) {
      const summary = new Summary({
        _user: req.user.id,
        originalText: "Image Analysis",
        summaryText: description,
        type: "image"
      });
      await summary.save();
    }

    res.json({ description });
  } catch (error) {
    console.error("Describe Error:", error);
    res.status(500).send({ error: "Failed to describe image" });
  }
});

app.post("/api/analyze-file", async (req, res) => {
  try {
    const { fileData, mimeType } = req.body;
    if (!fileData || !mimeType) return res.status(400).send({ error: "No file provided" });

    const result = await analyzeFile(fileData, mimeType);

    if (req.user) {
      const type = mimeType === "application/pdf" ? "pdf" : "audio";
      const summary = new Summary({
        _user: req.user.id,
        originalText: type === "pdf" ? "PDF Analysis" : "Audio Transcript",
        summaryText: result,
        type: type
      });
      await summary.save();
    }

    res.json({ result });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).send({ error: "Failed to analyze file" });
  }
});
const User = mongoose.model("users");
import bcrypt from "bcryptjs";

app.post("/api/signup", async (req, res) => {
  const { name, email, password, securityQuestion, securityAnswer } = req.body;
  if (!email || !password || !securityAnswer) {
    return res.status(422).send({ error: "Missing required fields" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(422).send({ error: "Email in use" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase(), 10); // Store answer safely

  const user = new User({
    displayName: name,
    email,
    password: hashedPassword,
    securityQuestion,
    securityAnswer: hashedAnswer,
  });

  await user.save();

  // Log user in immediately
  req.login(user, (err) => {
    if (err) return res.status(500).send(err);
    res.send(user);
  });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(404).send({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send({ error: "Invalid password" });

  req.login(user, (err) => {
    if (err) return res.status(500).send(err);
    res.send(user);
  });
});

app.post("/api/recover", async (req, res) => {
  // Step 1: Get Question or Verify Answer
  const { email, answer } = req.body;
  const user = await User.findOne({ email }).select("+securityAnswer");

  if (!user) return res.status(404).send({ error: "User not found" });

  if (!answer) {
    // Just return the question
    return res.send({ question: user.securityQuestion });
  } else {
    // Verify answer
    const isMatch = await bcrypt.compare(answer.toLowerCase(), user.securityAnswer);
    if (!isMatch) return res.status(401).send({ error: "Incorrect answer" });

    res.send({ verified: true });
  }
});

app.post("/api/reset", async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ error: "User not found" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.send({ success: true });
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);

app.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/api/current_user", (req, res) => {
  res.send(req.user);
});



app.get("/api/history", async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "You must log in!" });

  const summaries = await Summary.find({ _user: req.user.id }).sort({ date: -1 });
  res.send(summaries);
});

app.delete("/api/history/:id", async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "You must log in!" });

  try {
    const deletedSummary = await Summary.findOneAndDelete({ _id: req.params.id, _user: req.user.id });
    if (!deletedSummary) return res.status(404).send({ error: "Summary not found or not authorized" });

    res.send(deletedSummary);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete summary" });
  }
});

// Production Setup
// Production Setup
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  console.log("Serving static files from:", path.join(__dirname, "../frontend/dist"));
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
