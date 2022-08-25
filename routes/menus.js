const express = require("express");
const { indexMenu, newMenu, createMenu, showMenu, editMenu, updateMenu, deleteMenu } = require("../controllers/menus");


const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/").get(indexMenu);

router
  .route("/new")
  .get(protect, authorize("admin"), newMenu)
  .post(protect, authorize("admin"), createMenu);

router
  .route("/:id")
  .get(showMenu)
  .post(protect, authorize("admin"), deleteMenu);

router
  .route("/:id/edit")
  .get(protect, authorize("admin"), editMenu)
  .post(protect, authorize("admin"), updateMenu);

module.exports = router;