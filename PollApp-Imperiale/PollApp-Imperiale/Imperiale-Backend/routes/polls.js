const express = require("express");
const router = express.Router();
const { Poll } = require("../models/poll");

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3030 });

wss.on("connection", function connection(ws) {
  ws.send("Welcome");
  ws.on("message", function incoming(message) {
  });
});

// Getting all
router.get("/", async (req, res) => {
  try {
    console.log("entra")
    const poll = await Poll.find();
    console.log("respuesta1", poll)
    res.json(poll);
    console.log("respuesta",poll)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getpoll, (req, res) => {
  res.json(res.poll);
});

// Creating one
router.post("/", async (req, res) => {
  console.log("request test", req, res )
  const poll = new Poll({
    title: req.body.title,
    answers: req.body.answers,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });
  try {
    const newpoll = await poll.save();
    res.status(201).json(newpoll);
    wss.clients.forEach(function (client) {
      client.send("Update");
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getpoll, async (req, res) => {
  if (req.body.title != null) {
    res.poll.title = req.body.title;
    (res.poll.startDate = req.body.startDate),
      (res.poll.endDate = req.body.endDate);
  }
  if (req.body.answers != null) {
    res.poll.answers = req.body.answers;
  }
  try {
    const updatedpoll = await res.poll.save();
    res.json(updatedpoll);
    wss.clients.forEach(function (client) {
      client.send("Update");
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Vote One
router.patch("/:pollId/vote/:answerId", async (req, res) => {
  try {
    const result = await Poll.updateOne(
      {
        _id: req.params.pollId,
        "answers._id": req.params.answerId,
      },
      {
        $inc: {
          "answers.$.vote": 1,
        },
      }
    );
    res.json(result);
    wss.clients.forEach(function (client) {
      client.send("Update");
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getpoll, async (req, res) => {
  try {
    await res.poll.remove();
    res.json({ message: "Deleted poll" });
    wss.clients.forEach(function (client) {
      client.send("Update");
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getpoll(req, res, next) {
  let poll;
  try {
    poll = await Poll.findById(req.params.id);
    if (poll == null) {
      return res.status(404).json({ message: "Cannot find polls" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.poll = poll;
  next();
}

module.exports = router;
