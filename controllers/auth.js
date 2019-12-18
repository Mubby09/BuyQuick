exports.getLogin = (req, res, next) => {
  console.log("login");
  res.render("auth/login", {
    path: "/login",
    headTitle: "Login",
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  console.log("signup");
  res.render("auth/signup", {
    path: "/signUp",
    headTitle: "SignUp",
    isAuthenticated: false
  });
};
