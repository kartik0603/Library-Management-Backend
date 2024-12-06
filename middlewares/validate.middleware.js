

const { body, validationResult } = require("express-validator");

const validateBook = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("availability").isBoolean().withMessage("Availability must be a boolean value"),
  body("price").isNumeric().withMessage("Price must be a numeric value"),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateBook ;
