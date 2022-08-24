const express = require("express");
const { indexMenu, newMenu, createMenu, showMenu } = require("../controllers/menus");


const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, authorize("admin"), indexMenu);

router
  .route("/new")
  .get(protect, authorize("admin"), newMenu)
  .post(protect, authorize("admin"), createMenu);

router
  .route("/:id").get(protect, authorize("admin"), showMenu);

module.exports = router;