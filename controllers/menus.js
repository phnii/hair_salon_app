const User = require("../models/User");
const Menu = require("../models/Menu");

// @desc    メニュー一覧表示
// @route   GET /menus
// @access  Private/admin
exports.indexMenu = async (req, res, next) => {
  res.locals.menus = await Menu.find().populate({path: "staffs"});
  res.render("menus/index");
};

// @desc    メニュー詳細表示
// @route   GET /menus/:id
// @access  Private/admin
exports.showMenu = async (req, res, next) => {
  res.locals.menu = await Menu.findById(req.params.id).populate({path: "staffs"});
  res.render("menus/show");
};

// @desc    メニュー登録画面表示
// @route   GET /menus/new
// @access  Private/admin
exports.newMenu = async (req, res, next) => {
  res.locals.staffs = await User.find({ role: "staff" });
  res.locals.err = "";
  res.render("menus/new");
};

// @desc    メニュー登録
// @route   POST /menus/new
// @access  Private/admin
exports.createMenu = async (req, res, next) => {
  try {
    let menu = await Menu.create(req.body);
    res.redirect("/menus/new");
  } catch (err) {
    res.locals.err = err;
    res.render("menus/new");
  }
};
