const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserLoginActivitySchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      lastLoginTime: {
        type: Date,
        required: true
      },
    });
    
    const LastLogin = mongoose.model('LastLogin', UserLoginActivitySchema);
    
    module.exports = LastLogin;