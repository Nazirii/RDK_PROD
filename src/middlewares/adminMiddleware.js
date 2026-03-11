const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access is only for admins",
    });
  }

  next();
};

module.exports = isAdmin;
