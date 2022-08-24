const User = require("../models/User");
const Menu = require("../models/Menu");

// @desc    メニュー登録画面表示
// @route   GET /menu/new
// @access  Private/admin
exports.newMenu = async (req, res, next) => {
  res.locals.staffs = await User.find({ role: "staff" });
  res.locals.err = "";
  res.render("menus/new");
};

// @desc    メニュー登録画面表示
// @route   GET /menu/new
// @access  Private/admin
exports.createMenu = async (req, res, next) => {
  try {
    let menu = await Menu.create(req.body);
    res.redirect("/menus");
  } catch (err) {
    res.locals.err = err;
    res.render("menus/new");
  }
};
