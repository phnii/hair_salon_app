// @desc    ホームページ表示
// @route   GET /
// @access  Public
exports.home = async (req, res, next) => {
  res.render("home");
};