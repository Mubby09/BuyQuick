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
  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect("/");
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll(products => {
    console.log(products);
    res.render("admin/admin-products", {
      prods: products,
      headTitle: "Admin Products",
      path: "/admin-products"
    });
  });
};
