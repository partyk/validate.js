/**
 * validate.js — English locale (en)
 * Usage: validate.addLocale("en", en); validate.setLocale("en");
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    if (root.validate) factory(root.validate);
  }
})(typeof window !== "undefined" ? window : global, function (validate) {
  const messages = {
    required:    "This field is required.",
    remote:      "Please fix this field.",
    email:       "Please enter a valid email address.",
    url:         "Please enter a valid URL.",
    date:        "Please enter a valid date.",
    dateISO:     "Please enter a valid date (ISO format YYYY-MM-DD).",
    number:      "Please enter a valid number.",
    digits:      "Please enter only digits.",
    creditcard:  "Please enter a valid credit card number.",
    equalTo:     "Please enter the same value again.",
    maxlength:   "Please enter no more than {0} characters.",
    minlength:   "Please enter at least {0} characters.",
    rangelength: "Please enter a value between {0} and {1} characters long.",
    range:       "Please enter a value between {0} and {1}.",
    max:         "Please enter a value less than or equal to {0}.",
    min:         "Please enter a value greater than or equal to {0}.",
    step:        "Please enter a multiple of {0}.",
    pattern:     "Please check this field.",
  };

  if (typeof validate !== "undefined") {
    validate.addLocale("en", messages);
  }

  return messages;
});
