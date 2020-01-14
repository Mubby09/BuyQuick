const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body, check } = require("express-validator/check");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  [
    check("title")
      .isString()
      .isLength({ min: 2 })
      .trim()
      .withMessage("Invalid Title, Try again"),
    // body("price").isFloat(),
    body("sellerName")
      .isString()
      .isLength({ min: 5 }),
    // body("phone").isInt(),
    body("description")
      .trim()
      .isLength({ min: 5, max: 300 })
      .withMessage("Invalid Description, Try again")
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/admin-products", isAuth, adminController.getAdminProducts);

module.exports = router;
