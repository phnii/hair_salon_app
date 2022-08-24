const User = require("../models/User");
const Menu = require("../models/Menu");
const Book = require("../models/Book");

// @desc    予約一覧表示
// @route   GET /books
// @access  Private/admin
exports.indexBooks = async (req, res, next) => {
  let books = await Book.find().populate("user").populate("staff").populate("menu");
  res.locals.books = books;
  res.render("books/index");
};

// @desc    メニュー選択画面表示
// @route   GET /books/menus
// @access  Private/user,admin
exports.selectMenu = async (req, res, next) => {
  let menus = await Menu.find().populate("staffs");
  if (!menus) {
    res.send("メニューが登録されていません");
  }

  res.locals.menus = menus;
  res.render("books/menus");
};

// @desc    スタッフ選択画面表示
// @route   GET /books/staffs
// @access  Private/user,admin
exports.selectStaff = async (req, res, next) => {
  let staffs = await User.find({ role: "staff" });
  if (!staffs) {
    res.send("スタッフが在籍していません");
  }
  res.locals.menuId = req.query.menu;
  res.locals.staffs = staffs;
  res.render("books/staffs");
};

// @desc    予約日時選択画面表示
// @route   GET /books/calendar
// @access  Private/user,admin
exports.calendar = async (req, res, next) => {
  let staffs;
  let calSize = 30; // 今日から30日先まで予約可能
  let dayUnits = 20; // 1日20コマ営業
  staffs = await User.findById(req.query.staff);
  if (!staffs) {
    staffs = await User.find();
  }

  let menu = await Menu.findById(req.query.menu);

  let today = new Date();
  let reservingFrames = menu.unitNum; //今から予約しようとするコマ数
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  let bookObjects = await Book.find({ day: { $gte: today }}).populate("menu");
  let books = [];
  for (let i = 0; i < calSize; i++) {
    books.push([]);
  }
  for (let i = 0; i < bookObjects.length; i++) {
    // books[bookObjects[i].day.getDate() - today.getDate()].push([bookObjects[i].frame, bookObjects[i].frame + bookObjects[i].num - 1])
    let idx = parseInt((bookObjects[i].day - today) / 86400000) // 予約bookObjects[i]はテーブル上で何列(何日)目に入るか(今日の場合0)
    // 予約不可のコマ区間の先頭のコマのインデックスをstartFrameと置く
    // 予約済みのコマ区間の先頭より前のコマを(予約しようとするコマ数-1)だけXで塗りつぶす
    let startFrame = bookObjects[i].start - reservingFrames + 1 >= 0 ? bookObjects[i].start - reservingFrames + 1: 0
    books[idx].push([startFrame, bookObjects[i].start + bookObjects[i].menu.unitNum - 1])
  }
  // 全ての日付でテーブルの底から(予約するコマ数 - 1)分をXで塗りつぶす
  for (let i = 0; i < calSize; i++) {
    let el = [(dayUnits - 1) - reservingFrames + 2, (dayUnits - 1)];
    books[i].push(el);
  }
  res.locals.query = req.query;
  res.locals.books = books;
  res.render("books/calendar");
};

// @desc    予約送信確認画面表示
// @route   GET /books/confirmation
// @access  Private/user,admin
exports.confirmation = async (req, res, next) => {
  let newBook = new Book(req.query);
  newBook.user = req.user.id;
  let staff = await User.findById(req.query.staff);
  let menu = await Menu.findById(req.query.menu);
  res.locals.staff = staff;
  res.locals.menu = menu;
  res.locals.user = req.user;
  res.locals.book = newBook;
  res.render("books/confirmation");
};

// @desc    予約保存
// @route   GET /books/create
// @access  Private/user,admin
exports.createBook = async (req, res, next) => {
  try {
    let book = await Book.create(req.body);
    console.log(book)
  } catch (err) {
    next(err)
  }
  res.redirect("/books/menus");
};