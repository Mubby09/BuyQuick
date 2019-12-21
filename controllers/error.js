exports.error = (req, res, next) => {
  res.status(404).render("404", {
    headTitle: "Page not found",
    path: "req.url",
    isAuthenticated: req.session.loggedIn
  });
};
