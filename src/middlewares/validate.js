export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    try {
      const parsed = schema.parse(req[property]);
      req[property] = parsed;
      next();
    } catch (err) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };
