const mongoose = require('mongoose')
const moment = require('moment')

const AnswerSchema = new mongoose.Schema({
  text: String,
  vote: {
    type: Number,
    default: 0
  }
})

const PollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  answers: {
    type: [AnswerSchema]
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  }
})

const Answer = mongoose.model('Answer', AnswerSchema)
const Poll = mongoose.model('Poll', PollSchema)

module.exports = {
  Poll,
  Answer
}