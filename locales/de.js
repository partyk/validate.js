/**
 * validate.js — German locale (de)
 * Usage: validate.addLocale("de", de); validate.setLocale("de");
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    if (root.validate) factory(root.validate);
  }
})(typeof window !== "undefined" ? window : global, function (validate) {
  const messages = {
    required:    "Dieses Feld ist ein Pflichtfeld.",
    remote:      "Bitte korrigieren Sie dieses Feld.",
    email:       "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    url:         "Bitte geben Sie eine gültige URL ein.",
    date:        "Bitte geben Sie ein gültiges Datum ein.",
    dateISO:     "Bitte geben Sie ein gültiges Datum ein (ISO-Format YYYY-MM-DD).",
    number:      "Bitte geben Sie eine gültige Zahl ein.",
    digits:      "Geben Sie bitte nur Ziffern ein.",
    creditcard:  "Bitte geben Sie eine gültige Kreditkartennummer ein.",
    equalTo:     "Bitte denselben Wert wiederholen.",
    maxlength:   "Geben Sie bitte nicht mehr als {0} Zeichen ein.",
    minlength:   "Geben Sie bitte mindestens {0} Zeichen ein.",
    rangelength: "Geben Sie bitte einen Wert mit einer Länge zwischen {0} und {1} Zeichen ein.",
    range:       "Geben Sie bitte einen Wert zwischen {0} und {1} ein.",
    max:         "Geben Sie bitte einen Wert kleiner oder gleich {0} ein.",
    min:         "Geben Sie bitte einen Wert größer oder gleich {0} ein.",
    step:        "Geben Sie bitte ein Vielfaches von {0} ein.",
    pattern:     "Der Wert entspricht nicht dem erforderlichen Format.",
  };

  if (typeof validate !== "undefined") {
    validate.addLocale("de", messages);
  }

  return messages;
});
