const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        headTitle: "SHOPPING",
        path: "/",
        isAuthenticated: req.session.loggedIn
      });
    })
    .catch((err) => {
      throw err;
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        headTitle: "ALL-PRODUCTS",
        path: "/products",
        isAuthenticated: req.session.loggedIn
      });
    })
    .catch((err) => {
      throw err;
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; //Getting the product as part of the url in the shop.js Route.
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        headTitle: "product.title",
        path: "/products",
        isAuthenticated: req.session.loggedIn
      });
    })
    .catch((err) => {
      throw err;
    });
};
