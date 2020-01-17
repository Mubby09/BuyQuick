const Product = require("../models/product");
const ITEMS_PER_PAGE = 50;

exports.getIndex = (req, res, next) => {
  const page = req.query.page;
  Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        headTitle: "SHOPPING",
        path: "localhost:3000/"
        // isAuthenticated: req.session.loggedIn,
        // csrfToken: req.csrfToken()
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({})
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        headTitle: "ALL-PRODUCTS",
        path: "/products",
        isAuthenticated: req.session.loggedIn
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
