const express = require("express");
const fs = require("fs");
const path = require("path");

// const { env } = require("process");
// const notesData = require("./db/db.json");

const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) => {
  console.log(`${req.method} request received to notes.html`);
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app
  .route("/api/notes")
  .get((req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
      }
    });
  })
  .post((req, res) => {
    console.log(req.body);
    const { title, text } = req.body;
    if (title && text) {
      // check to see if title and text exist
      // const newPost = {
      //   // create new object to store
      //   title: title,
      //   text: text,
      //   id: uuid(),
      // };
      const newPost = {
        title: title,
        text: text,
        id: uuidv4(),
      };

      // read the existing json
      fs.readFile("./db/db.json", (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // parse json to array, then write to new file
          const parsedNotes = JSON.parse(data);
          parsedNotes.push(newPost);
          fs.writeFile(
            "./db/db.json",
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info("Updated notes!")
          );
        }
      });
      res.status(201).json({ status: "success", body: newPost });
    } else {
      res.status(500).json("Error making post");
    }
  });
app.delete("/api/notes/:id", (req, res) => {
  const idToDelete = req.params.id;

  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      for (let note of parsedNotes) {
        if (note.id === idToDelete) {
          const indexToDelete = parsedNotes.indexOf(note);

          parsedNotes.splice(indexToDelete, 1);

          fs.writeFile(
            "./db/db.json",
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info("Updated notes!")
          );

          res.status(200).json({ status: "success", body: "Item deleted" });
        }
      }
    }
  });
});
// GET Route for homepage
app.get("*", (req, res) => {
  console.log(`${req.method} request received to index.html`);
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
