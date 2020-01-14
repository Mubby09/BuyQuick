exports.get500 = (req, res, next) => {
  res.status(500).render("500", {
    headTitle: "Something Went Wrong",
    path: "req.url",
    isAuthenticated: req.session.loggedIn
  });
};
