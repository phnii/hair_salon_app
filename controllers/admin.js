const User = require("../models/User");
const Book = require("../models/Book");
const Menu = require("../models/Menu");

// @desc    管理者トップページ表示
// @route   GET /admin
// @access  Private/admin
exports.top = (req, res, next) => {
  res.render("admin/top");
};

// @desc    管理者ページスタッフ一覧表示
// @route   GET /admin/staffs
// @access  Private/admin
exports.getStaffs = async (req, res, next) => {
  let staffs = await User.find({ role: "staff" });
  res.locals.staffs = staffs;
  res.render("admin/staffs");
};

// @desc    管理者ページスタッフ詳細表示
// @route   GET /admin/staffs/:id
// @access  Private/admin
exports.getStaff = async (req, res, next) => {
  let staff = await User.findById(req.params.id).populate("menus");
  let menus = await staff.getMenus();
  let books = await Book.find({ staff: staff._id }).populate("user").populate("staff").populate("menu");
  res.locals.staff = staff;
  res.locals.menus = menus;
  res.locals.books = books;
  res.locals.dateFormat = require("../dateFormat");
  res.render("admin/staff");
};

// @desc    新規スタッフ作成画面表示
// @route   GET /admin/staffs/new
// @access  Private/admin
exports.newStaff = async (req, res, next) => {
  res.locals.menus = await Menu.find();
  res.locals.err = "";
  res.render("admin/newStaff");
};

// @desc    新規スタッフ登録
// @route   POST /admin/staffs/new
// @access  Private/admin
exports.createStaff = async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;
  const menus = req.body.menus;
  try {
    let staff = await User.create({
      name,
      email,
      password,
      role,
      phone
    });

    // 選択されたメニューにstaffを追加する
    for (menuId of menus) {
      let menu = await Menu.findById(menuId);
      menu.staffs.push(staff._id);
      await menu.save();
    };
    res.redirect("/admin/staffs");
  } catch (err) {
    res.locals.err = err;
    res.locals.menus = await Menu.find();
    res.render("admin/newStaff");
  }
};