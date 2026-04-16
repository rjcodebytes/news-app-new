const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// Connect MongoDB
mongoose.connect("mongodb://localhost:27017/newsdb");

// Schema
const newsSchema = new mongoose.Schema({
    title: String,
    description: String
});

const News = mongoose.model("News", newsSchema);

// POST - Add news
app.post("/news", async (req, res) => {
    const { title, description } = req.body;

    const news = new News({ title, description });
    await news.save();

    res.json({ message: "News added successfully" });
});

// GET - Fetch news
app.get("/news", async (req, res) => {
    const data = await News.find();
    res.json(data);
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://localhost:3000");
});