export const enforcePasswordChange = (req, res, next) => {
  if (
    req.user.role === "STUDENT" &&
    req.user.force_password_change
  ) {
    return res.status(403).json({
      message: "Password change required",
      code: "FORCE_PASSWORD_CHANGE",
    });
  }

  next();
};
