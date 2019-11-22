const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    console.log(products);
    res.render("shop/index", {
      prods: products,
      headTitle: "SHOPPING",
      path: "/"
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    console.log(products);
    res.render("shop/product-list", {
      prods: products,
      headTitle: "ALL-PRODUCTS",
      path: "/products"
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    headTitle: "Cart"
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    headTitle: "Checkout"
  });
};
