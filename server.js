const express = require("express");
const path = require("path");
const fs = require("fs");
// const { env } = require("process");
const notesData = require("./db/db.json");

const uuid = require("./helper/uuid");

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "public"));

// GET Route for homepage
app.get("*", (req, res) => {
  console.log(`${req.method} request received to index.html`);
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
  console.log(`${req.method} request received to notes.html`);
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET Route for notes page

// app.route("/api/notes").get((req, res) => {
//   // Send a message to the client
//   fs.readFile("./db/db.json", (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       const parsedData = JSON.parse(data);
//       res.status(200).json(parsedData);
//     }
//   });
// });

// POST request to add a notes
app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { noteTitle, noteText } = req.body;

  // If all the required properties are present
  if (noteTitle && noteText) {
    // Variable for the object we will save
    const newReview = {
      noteTitle,
      noteText,
    };

    // Obtain existing reviews
    fs.readFile("./db/reviews.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedReviews = JSON.parse(data);

        // Add a new review
        parsedReviews.push(newReview);

        // Write updated reviews back to the file
        fs.writeFile(
          "./db/reviews.json",
          JSON.stringify(parsedReviews, null, 2),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated reviews!")
        );
      }
    });

    const response = {
      status: "success",
      body: newReview,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
