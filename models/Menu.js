const mongoose = require("mongoose");

const  MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "メニュー名を入力してください"],
    maxLength: 50
  },
  description: {
    type: String,
    maxLength: 200
  },
  price: {
    type: Number,
    required: [true, "価格を入力してください"],
    min: 1
  },
  unitNum: {
    type: Number,
    required: [true, "コマ数を入力してください"],
    min: 1
  },
  staffs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],
});

module.exports = mongoose.model("Menu", MenuSchema);