const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rewards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reward'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
