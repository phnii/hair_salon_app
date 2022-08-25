const express = require("express");
const { top, getStaff, getStaffs } = require("../controllers/admin");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, authorize("admin") ,top);
router.route("/staffs").get(protect, authorize("admin"), getStaffs);
router.route("/staffs/:id").get(protect, authorize("admin"), getStaff);

module.exports = router;