const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

module.exports = router;
