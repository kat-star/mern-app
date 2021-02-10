const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateListingInput(data) {
  let errors = {};

  data.text = validText(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, { min: 5, max: 500 })) {
    errors.text = "Item description cannot exceed 500 characters"
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Item description is required"
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}