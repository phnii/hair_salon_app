const express = require("express");
const { indexBooks,
        showBook,
        selectMenu,
        selectStaff,
        calendar,
        confirmation,
        createBook,
        deleteBook,
        adminCalendar,
        adminStaffs,
        adminCreate
       } = require("../controllers/books");


const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, authorize("admin"), indexBooks);

router.route("/menus").get(protect, authorize("user", "admin"), selectMenu);

router
  .route("/staffs")
  .get(protect, authorize("user", "admin"), selectStaff)
  // .post(protect, authorize("user", "admin"), createMenu);

router
  .route("/calendar")
  .get(protect, authorize("user", "admin"), calendar)

router
  .route("/confirmation")
  .get(protect, authorize("user", "admin"), confirmation);

router
  .route("/create")
  .post(protect, authorize("user", "admin"), createBook)

router
  .route("/delete/:id")
  .get(protect, authorize("user", "admin"), deleteBook)

router
  .route("/admin/calendar")
  .get(protect, authorize("admin"), adminCalendar);

router
  .route("/admin/staffs")
  .get(protect, authorize("admin"), adminStaffs);

router
  .route("/admin/create")
  .post(protect, authorize("admin"), adminCreate);

router
  .route("/:id")
  .get(protect, authorize("user", "admin"), showBook);

module.exports = router;