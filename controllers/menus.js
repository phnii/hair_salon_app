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
    res.locals.staffs = await User.find({ role: "staff" });
    res.render("menus/new");
  }
};

// @desc    メニュー編集画面表示
// @route   GET /menus/:id/edit
// @access  Private/admin
exports.editMenu = async (req, res, next) => {
  res.locals.err = null;
  res.locals.staffs = await User.find({ role: "staff" });
  res.locals.menu = await Menu.findById(req.params.id).populate({path: "staffs"});
  res.render("menus/edit");
};

// @desc    メニュー編集画面表示
// @route   PUT /menus/:id/edit
// @access  Private/admin
exports.updateMenu = async (req, res, next) => {
  let menu = await Menu.findById(req.params.id);

  if (!menu) {
    res.redirect(`/menus/${req.params.id}/edit`);
  }

  try {
    menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  } catch (err) {
    res.locals.err = err;
    res.locals.menu = menu; 
    res.locals.staffs = await User.find({ role: "staff" });
    return res.render("menus/edit");
  }

  res.redirect(`/menus/${req.params.id}/edit`);
};

// @desc    メニュー削除
// @route   POST /menus/:id
// @access  Private/admin
exports.deleteMenu = async (req, res, next) => {
  try {
    let menu = await Menu.findByIdAndDelete(req.params.id);
    res.redirect("/menus");
  } catch(err) {
    res.redirect("/menus");
  }
};