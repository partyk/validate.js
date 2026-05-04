/**
 * validate.js — Czech locale (cs)
 * Usage: validate.addLocale("cs", cs); validate.setLocale("cs");
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
    email:       "Zadejte platnou e-mailovou adresu.",
    url:         "Zadejte platnou URL adresu.",
    date:        "Zadejte platné datum.",
    dateISO:     "Zadejte platné datum (formát YYYY-MM-DD).",
    number:      "Zadejte platné číslo.",
    digits:      "Zadejte pouze číslice.",
    creditcard:  "Zadejte platné číslo kreditní karty.",
    equalTo:     "Zadejte prosím stejnou hodnotu znovu.",
    maxlength:   "Zadejte nejvýše {0} znaků.",
    minlength:   "Zadejte alespoň {0} znaků.",
    rangelength: "Zadejte hodnotu v délce {0} až {1} znaků.",
    range:       "Zadejte hodnotu od {0} do {1}.",
    max:         "Zadejte hodnotu menší nebo rovnou {0}.",
    min:         "Zadejte hodnotu větší nebo rovnou {0}.",
    step:        "Zadejte násobek čísla {0}.",
    pattern:     "Hodnota neodpovídá požadovanému formátu.",
  };

  if (typeof validate !== "undefined") {
    validate.addLocale("cs", messages);
  }

  return messages;
});
