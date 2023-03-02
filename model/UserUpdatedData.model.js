const mongoose = require('mongoose');

const updatedFieldsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email:{
    type: String,
    required: true
  },
  fieldschanged: {
    type:[String]
  },
  oldValue: {
    type: {}
  },
  newValue: {
    type: {}
  },
  updatedTime: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const UpdatedFields = mongoose.model('updatedFields', updatedFieldsSchema);

module.exports = UpdatedFields;
