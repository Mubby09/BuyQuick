const Product = require("../models/product");
const { validationResult } = require("express-validator/check");
const mongoose = require("mongoose");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    headTitle: "ADD-PRODUCT",
    path: "/add-product",
    isAuthenticated: req.session.loggedIn,
    errorMessage: null,
    oldInput: {
      title: "",
      image: "",
      price: "",
      sellerName: "",
      // phone: "",
      description: ""
    }
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const sellerName = req.body.sellerName;
  // const phone = req.body.tel;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render("admin/add-product", {
      headTitle: "ADD-PRODUCT",
      path: "/add-product",
      isAuthenticated: req.session.loggedIn,
      errorMessage: "Attached file is not an Image, Please select an image",
      oldInput: {
        title: title,
        price: price,
        sellerName: sellerName,
        // phone: phone,
        description: description
      }
    });
  }
  // console.log(imageUrl);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/add-product", {
      headTitle: "ADD-PRODUCT",
      path: "/add-product",
      isAuthenticated: req.session.loggedIn,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        title: title,
        image: image,
        price: price,
        sellerName: sellerName,
        // phone: phone,
        description: description
      }
    });
  }
  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    sellerName: sellerName,
    // phone: phone,
    userId: req.user
  });
  product
    .save()
    .then((result) => {
      console.log("product created");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/500");
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
    });
};

exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: true })
    .then((products) => {
      console.log(products);
      res.render("admin/admin-products", {
        prods: products,
        headTitle: "Admin Products",
        path: "/admin-products",
        isAuthenticated: req.session.loggedIn
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
