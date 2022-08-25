const User = require("../models/User");
const Book = require("../models/Book");

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
