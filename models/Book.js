const mongoose = require("mongoose");
const { Schema } = mongoose;

const { OPEN_TIME } = require("../settings");

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

// 施術開始時刻を返す
BookSchema.methods.getStartTime = function() {
  let result = new Date(OPEN_TIME * 1 + this.start * 30 * 60 * 1000);
  // OPEN_TIMEは時間しか正しくないため年月日を書き換える
  result.setFullYear(this.day.getFullYear());
  result.setMonth(this.day.getMonth());
  result.setDate(this.day.getDate());
  return result;
};

// 施術終了時刻を返す
BookSchema.methods.getEndTime = function() {
  return new Date(this.getStartTime() * 1 + this.menu.unitNum * 30 * 60 * 1000);
};

module.exports = mongoose.model("Book", BookSchema);