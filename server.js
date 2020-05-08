// Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutTracker", { useNewUrlParser: true });

// API Routes ------------------------------------------------------------------------------------------------
app.get("/api/workouts", function (req, res) {
    db.Workout.find({})
        .then(workouts => {
            res.json(workouts);
        })
        .catch(err => {
            res.json(err);
        });
});

app.post("/api/workouts", function (req, res) {
    db.Workout.create(req.body)
        .then(workouts => {
            res.json(workouts);
        })
        .catch(err => {
            res.json(err);
        });
});

app.put("/api/workouts/:id", function (req, res) {
    db.Workout.update({
        _id: req.params.id
    },
        {
            $push: {
                exercises: req.body
            },
            $inc: {
                totalDuration: req.body.duration
            }
        },
        {
            new: true
        })
        .then(workouts => {
            res.json(workouts);
        })
        .catch(err => {
            res.json(err);
        });
});

// HTML Routes -----------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "public/stats.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "public/exercise.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
