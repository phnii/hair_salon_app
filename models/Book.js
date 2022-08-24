const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookSchema = new Schema({
  day: {
    type: Date,
    required: [true, "日付を指定してください"]
  },
  start: {
    type: Number,
    required: [true, "開始コマを指定してください"]
  },
  status: {
    type: String,
    enum: ["new", "determined", "done"],
    default: "new"
  },
  menu: {
    type: Schema.Types.ObjectId,
    ref: "Menu",
    required: [true, "メニューを選択してください"]
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "スタッフを選択してください"]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "ユーザーログインしてください"]
  }
});

module.exports = mongoose.model("Book", BookSchema);