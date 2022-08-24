const express = require("express");
const { newMenu, createMenu } = require("../controllers/menus");


const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, authorize("admin"), newMenu)
  .post(protect, authorize("admin"), createMenu);

module.exports = router;