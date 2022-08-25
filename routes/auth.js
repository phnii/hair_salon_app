const express = require("express");
const { registerView,
        register,
        loginView,
        login,
        logout,
        getMe,
        adminTop,
        getStaffs,
        getStaff
} = require("../controllers/auth");


const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router
  .route("/register")
  .get(registerView)
  .post(register);
router
  .route("/login")
  .get(loginView)
  .post(login);
router.get("/me",protect, getMe);
router.get("/logout", logout);
router.get("/admin", protect, authorize("admin"), adminTop)
router.get("/admin/staffs", protect, authorize("admin"), getStaffs);
router.get("/admin/staffs/:id", protect, authorize("admin"), getStaff);

module.exports = router;