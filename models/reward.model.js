// Libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewardSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
		quantity: {
			type: Number,
			required: true
		},
    imageUrl: {
      type: String,
      required: true
    }
  },
  { 
		timestamps: true 
	}
);

module.exports = mongoose.model('Reward', rewardSchema);
