/**
 * validate.js — Slovak locale (sk)
 * Usage: validate.addLocale("sk", sk); validate.setLocale("sk");
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    if (root.validate) factory(root.validate);
  }
})(typeof window !== "undefined" ? window : global, function (validate) {
  const messages = {
    required:    "Toto pole je povinné.",
    remote:      "Opravte prosím toto pole.",
    email:       "Zadajte platnú e-mailovú adresu.",
    url:         "Zadajte platnú URL adresu.",
    date:        "Zadajte platný dátum.",
    dateISO:     "Zadajte platný dátum (formát YYYY-MM-DD).",
    number:      "Zadajte platné číslo.",
    digits:      "Zadajte iba číslice.",
    creditcard:  "Zadajte platné číslo kreditnej karty.",
    equalTo:     "Zadajte rovnakú hodnotu znovu.",
    maxlength:   "Zadajte najviac {0} znakov.",
    minlength:   "Zadajte aspoň {0} znakov.",
    rangelength: "Zadajte hodnotu v dĺžke {0} až {1} znakov.",
    range:       "Zadajte hodnotu od {0} do {1}.",
    max:         "Zadajte hodnotu menšiu alebo rovnú {0}.",
    min:         "Zadajte hodnotu väčšiu alebo rovnú {0}.",
    step:        "Zadajte násobok čísla {0}.",
    pattern:     "Hodnota nezodpovedá požadovanému formátu.",
  };

  if (typeof validate !== "undefined") {
    validate.addLocale("sk", messages);
  }

  return messages;
});
