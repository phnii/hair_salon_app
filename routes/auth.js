const express = require("express");
const { registerView,
        register,
        loginView,
        login,
        logout,
        getMe,
} = require("../controllers/auth");


const router = express.Router();

const { protect } = require("../middleware/auth");

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

module.exports = router;