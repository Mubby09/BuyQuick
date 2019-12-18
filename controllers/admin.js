const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  console.log("I'm here again");
  res.render("admin/add-product", {
    // prods: products,
    headTitle: "ADD-PRODUCT",
    path: "/add-product"
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
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
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("admin/admin-products", {
        prods: products,
        headTitle: "Admin Products",
        path: "/admin-products"
      });
    })
    .catch((err) => {
      throw err;
    });
};
