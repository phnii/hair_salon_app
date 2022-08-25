const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const Book = require("../models/Book");

// @desc    ユーザー登録画面表示
// @route   GET /auth/register
// @access  Public
exports.registerView = (req, res, next) => {
  res.locals.err = "";
  res.render("auth/register.ejs")
}

// @desc    ユーザー登録
// @route   POST /auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  // Create user
  try {
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone
    });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.locals.err = err;
    return res.render("auth/register.ejs");
  }
};

// @desc    ユーザー登録画面表示
// @route   GET /auth/register
// @access  Public
exports.loginView = (req, res, next) => {
  res.locals.err = "";
  res.render("auth/login.ejs");
};

// @desc    ユーザーログイン
// @route   POST /auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    let err = new ErrorResponse("メールアドレスを入力してください", 400);
    res.locals.err = err;
    return res.render("auth/login.ejs");
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {

    let err = new ErrorResponse("メールアドレスとパスワードの組が正しくありません", 400);
    res.locals.err = err;
    return res.render("auth/login.ejs");
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    let err = new ErrorResponse("メールアドレスとパスワードの組が正しくありません", 400);
    res.locals.err = err;
    return res.render("auth/login.ejs");
  }

  sendTokenResponse(user, 200, res);
};

// @desc    ログイン中のユーザーのデータを取得する
// @route   POST /auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({ path: "books", populate: { path: "menu" }}).populate({ path: "books", populate: { path: "staff" }});
  updateMyBooks(user.books);
  res.locals.user = user;
  res.locals.dateFormat = require("../dateFormat");
  res.render("auth/me");
});

// @desc    ログアウトする
// @route   GET /auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.redirect("/");
});

// @desc    管理者トップページ表示
// @route   GET /auth/admin
// @access  Private/admin
exports.adminTop = (req, res, next) => {
  res.render("auth/adminTop");
};

// @desc    管理者ページスタッフ一覧表示
// @route   GET /auth/admin/staffs
// @access  Private/admin
exports.getStaffs = async (req, res, next) => {
  let staffs = await User.find({ role: "staff" });
  res.locals.staffs = staffs;
  res.render("auth/staffs");
};

// @desc    管理者ページスタッフ詳細表示
// @route   GET /auth/admin/staffs/:id
// @access  Private/admin
exports.getStaff = async (req, res, next) => {
  let staff = await User.findById(req.params.id).populate("menus");
  let menus = await staff.getMenus();
  let books = await Book.find({ staff: staff._id }).populate("user").populate("staff").populate("menu");
  res.locals.staff = staff;
  res.locals.menus = menus;
  res.locals.books = books;
  res.locals.dateFormat = require("../dateFormat");
  res.render("auth/staff");
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.cookie("token", token, options).redirect("/")
};

// 予約の配列を受け取って終了時刻>現在時刻になっているもののstatusをdoneに書き換える
const updateMyBooks = async (books) => {
  const now = new Date();
  for (book of books) {
    console.log(`${book.getEndTime()}`.red)
    if (book.getEndTime() < now) {
      book.status = "done";
      let updatedBook = await book.save();
    }
  }
};