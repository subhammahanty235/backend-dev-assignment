const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'User']
  },
  department: {
    type: String,
    required: false
  },
  createdTime: {
    type:Date,
    default:new Date()
  },
  updatedTime: {
    type:Date,
    default:new Date()
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;
