var express = require("express");
var router = express.Router();
const Note = require("../models/note");
const withAuth = require("../middlewares/auth");

router.post("/", withAuth, async (req, res) => {
  const { title, body } = req.body;
  try {
    let note = new Note({ title: title, body: body, author: req.user._id });
    await note.save();
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: `Problem to create a new note= ${err}` });
  }
});

router.get("/search", withAuth, async (req, res) => {
  const { query } = req.query;
  console.log(query);
  try {
    let notes = await Note.find({ author: req.user._id }).find({
      $text: { $search: query },
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: `Problem to search a note= ${error}` });
  }
});

router.get("/:id", withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let note = await Note.findById(id);
    if (isOwner(req.user, note)) {
      res.status(200).json(note);
    } else {
      res.status(403).json({ error: `Permission denied= ${err}` });
    }
  } catch (error) {
    res.status(500).json({ error: `Problem to get a note= ${error}` });
  }
});

router.get("/", withAuth, async (req, res) => {
  try {
    let notes = await Note.find({ author: req.user._id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: `Erro get all notes: ${error}` });
  }
});

router.put("/:id", withAuth, async (req, res) => {
  const { title, body } = req.body;
  const { id } = req.params;
  try {
    let note = await Note.findById(id);
    if (isOwner(req.user, note)) {
      let note = await Note.findOneAndUpdate(
        id,
        { $set: { title: title, body: body } },
        { upsert: true, new: true }
      );
      res.status(200).json(note);
    } else {
      res.status(500).json({ error: `Permission denied ${error}` });
    }
  } catch (error) {
    res.status(500).json({ error: `Problem to update a note: ${error}` });
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let note = await Note.findById(id);
    if (isOwner(req.user, note)) {
      await note.delete();
      res.status(204).json({ message: "OK" });
    } else {
      res.status(500).json({ error: `Permission denied ${error}` });
    }
  } catch (error) {
    res.status(500).json({ error: `Problem to update a note: ${error}` });
  }
});

const isOwner = (user, note) => {
  if (JSON.stringify(user._id) == JSON.stringify(note.author._id)) {
    return true;
  } else return false;
};

module.exports = router;
