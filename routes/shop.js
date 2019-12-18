const express = require("express");
const path = require("path");
const router = express.Router();
const shopController = require("../controllers/shop");
const app = express();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

module.exports = router;
