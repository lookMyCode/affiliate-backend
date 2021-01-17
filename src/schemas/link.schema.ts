import * as mongoose from 'mongoose';

export const LinkSchema = new mongoose.Schema({
  name: String,
  originalLink: String,
  shortLink: String,
  clicks: [Date],
  created: Date,
  _autorId: mongoose.Schema.Types.ObjectId
})