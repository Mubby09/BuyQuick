const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/admin-products", isAuth, adminController.getAdminProducts);

module.exports = router;
