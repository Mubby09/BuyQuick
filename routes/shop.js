const express = require("express");
const path = require("path");
const router = express.Router();
const shopController = require("../controllers/shop");
const app = express();
const isAuth = require("../middleware/is-auth");

router.get("/", isAuth, shopController.getIndex);

router.get("/products", isAuth, shopController.getProducts);

router.get("/products/:productId", isAuth, shopController.getProduct);

module.exports = router;
