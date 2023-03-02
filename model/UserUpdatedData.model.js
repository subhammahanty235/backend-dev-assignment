const mongoose = require('mongoose');

const updatedFieldsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  email:{
    type:mongoose.Schema.Types.String,
    ref:'user',
    required: true
  },
  role:{
    type:mongoose.Schema.Types.String,
    ref:'user',
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
