const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const authController = require("../controllers/auth");
const { check, body } = require("express-validator/check");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    check("email", "Enter a valid Email")
      .isEmail()
      .normalizeEmail(),
    body("password", "Password do not match the above Email")
      .isAlphanumeric()
      .isLength({ min: 5 })
      .trim()
  ],
  authController.postLogin
);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email", "Enter a valid Email")
      .isEmail()
      .normalizeEmail(),
    // .withMessage("Enter a valid Email")
    body(
      "password",
      "please enter a password not shorter than 5 and has either letters and numbers"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
