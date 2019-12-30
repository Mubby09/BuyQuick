const Product = require("../models/product");
const { validationResult } = require("express-validator/check");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    headTitle: "ADD-PRODUCT",
    path: "/add-product",
    isAuthenticated: req.session.loggedIn,
    errorMessage: null,
    oldInput: {
      title: "",
      imageUrl: "",
      price: "",
      description: ""
    }
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
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
        imageUrl: imageUrl,
        price: price,
        description: description
      }
    });
  }

  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
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
      throw err;
    });
};
