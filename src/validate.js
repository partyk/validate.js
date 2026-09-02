/**
 * validate.js — Vanilla JS alternativa k jQuery Validation Plugin
 * Syntaxe co nejbližší https://jqueryvalidation.org/
 *
 * @version 1.0.4
 * @license MIT
 * @see https://github.com/yourusername/validate.js
 */

(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.validate = factory();
    if (typeof HTMLFormElement !== "undefined") {
      HTMLFormElement.prototype.validate = function (options) {
        return root.validate(this, options);
      };
    }
  }
})(typeof window !== "undefined" ? window : global, function () {

  // ─── Vestavěné validační metody ────────────────────────────────────────────

  const methods = {
    /**
     * Ověří, zda je pole povinné a zda obsahuje hodnotu.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {boolean} param Příznak, zda je pravidlo aktivní.
     * @returns {boolean} True, pokud je hodnota validní nebo pokud pravidlo není aktivní.
     */
    required(value, element, param) {
      if (!param) return true;
      if (element.type === "checkbox" || element.type === "radio") {
        const name = element.name;
        const form = element.form;
        if (!form) return element.checked;

        const group = form.elements[name];
        if (!group) return element.checked;

        const controls =
          typeof group.length === "number" && !group.type
            ? Array.from(group)
            : [group];

        return controls.some((el) => el && el.checked);
      }
      return value.trim() !== "";
    },

    /**
     * Ověří minimální délku hodnoty.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {number|string} param Minimální délka.
     * @returns {boolean} True, pokud má hodnota minimální počet znaků.
     */
    minlength(value, element, param) {
      return value.trim().length >= parseInt(param, 10);
    },

    /**
     * Ověří maximální délku hodnoty.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {number|string} param Maximální délka.
     * @returns {boolean} True, pokud hodnota nepřesahuje maximální délku.
     */
    maxlength(value, element, param) {
      return value.trim().length <= parseInt(param, 10);
    },

    /**
     * Ověří, zda délka hodnoty leží v daném rozsahu.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {number[]} param Rozsah [min, max].
     * @returns {boolean} True, pokud je délka v rozsahu.
     */
    rangelength(value, element, param) {
      const len = value.trim().length;
      return len >= param[0] && len <= param[1];
    },

    /**
     * Ověří menší nebo rovnou minimální hranici číselné hodnoty.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {number|string} param Minimální povolená hodnota.
     * @returns {boolean} True, pokud je hodnota větší nebo rovna limitu.
     */
    min(value, element, param) {
      return parseFloat(value) >= parseFloat(param);
    },

    /**
     * Ověří, zda hodnota nepřesahuje maximální hranici.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {number|string} param Maximální povolená hodnota.
     * @returns {boolean} True, pokud je hodnota menší nebo rovna limitu.
     */
    max(value, element, param) {
      return parseFloat(value) <= parseFloat(param);
    },

    /**
     * Ověří, zda hodnota leží v zadaném numerickém rozsahu.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {number[]} param Rozsah [min, max].
     * @returns {boolean} True, pokud hodnota leží v rozsahu.
     */
    range(value, element, param) {
      const v = parseFloat(value);
      return v >= param[0] && v <= param[1];
    },

    /**
     * Ověří, zda hodnota je celočíselným násobkem zadaného kroku.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {number|string} param Velikost kroku.
     * @returns {boolean} True, pokud je hodnota násobkem kroku.
     */
    step(value, element, param) {
      const v = parseFloat(value);
      const s = parseFloat(param);
      return Math.abs((v / s) % 1) < 1e-10 || Math.abs((v / s) % 1 - 1) < 1e-10;
    },

    /**
     * Ověří formát e-mailové adresy.
     *
     * @param {string} value Aktuální hodnota pole.
     * @returns {boolean} True, pokud je e-mail ve validním formátu.
     */
    email(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    /**
     * Ověří, zda je hodnota validní URL.
     *
     * @param {string} value Aktuální hodnota pole.
     * @returns {boolean} True, pokud je URL platná.
     */
    url(value) {
      try { new URL(value); return true; } catch { return false; }
    },

    /**
     * Ověří, zda je hodnota platné datum.
     *
     * @param {string} value Aktuální hodnota pole.
     * @returns {boolean} True, pokud je datum parsovatelný.
     */
    date(value) {
      return !isNaN(Date.parse(value));
    },

    /**
     * Ověří, zda je hodnota datum v ISO formátu YYYY-MM-DD.
     *
     * @param {string} value Aktuální hodnota pole.
     * @returns {boolean} True, pokud má datum správný ISO formát a je validní.
     */
    dateISO(value) {
      return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
    },

    /**
     * Ověří, zda je hodnota validní číslo.
     *
     * @param {string} value Aktuální hodnota pole.
     * @returns {boolean} True, pokud má hodnota správný numerický formát.
     */
    number(value) {
      return /^-?(\d+|\d*\.\d+)$/.test(value);
    },

    /**
     * Ověří, zda obsahuje pouze číslice.
     *
     * @param {string} value Aktuální hodnota pole.
     * @returns {boolean} True, pokud hodnota obsahuje pouze čísla.
     */
    digits(value) {
      return /^\d+$/.test(value);
    },

    /**
     * Ověří číslo kreditní karty pomocí Luhnova algoritmu.
     *
     * @param {string} value Aktuální hodnota pole.
     * @returns {boolean} True, pokud je číslo kreditní karty validní.
     */
    creditcard(value) {
      const s = value.replace(/\s|-/g, "");
      if (!/^\d{13,19}$/.test(s)) return false;
      let sum = 0;
      let alt = false;
      for (let i = s.length - 1; i >= 0; i--) {
        let n = parseInt(s[i], 10);
        if (alt) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
        alt = !alt;
      }
      return sum % 10 === 0;
    },

    /**
     * Ověří, zda hodnota odpovídá hodnotě jiného pole.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {string|HTMLElement} param Selektor nebo odkaz na cílový element.
     * @returns {boolean} True, pokud se hodnota shoduje s hodnotou cílového pole.
     */
    equalTo(value, element, param) {
      const target =
        typeof param === "string"
          ? (element.form || document).querySelector(param)
          : param;
      return target ? value === target.value : false;
    },

    /**
     * Ověří, zda hodnota odpovídá zadanému regulárnímu výrazu.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {RegExp|string} param Regulární výraz nebo jeho text.
     * @returns {boolean} True, pokud hodnota splňuje vzor.
     */
    pattern(value, element, param) {
      const re = param instanceof RegExp ? param : new RegExp(param);
      return re.test(value);
    },

    /**
     * Ověří hodnotu asynchronně přes vzdálený server.
     *
     * @param {string} value Aktuální hodnota pole.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element Validovaný element.
     * @param {string|Object} param Adresa endpointu nebo konfigurační objekt pro remote validaci.
     * @returns {Promise<boolean>} Promise s výsledkem remote validace.
     */
    remote(value, element, param) {
      const url = typeof param === "string" ? param : param.url;
      const method = (param && param.type) || "GET";
      const data = (param && param.data) ? param.data(element) : {};
      const qs = new URLSearchParams({ ...data, [element.name]: value }).toString();
      const fetchUrl = method.toUpperCase() === "GET" ? `${url}?${qs}` : url;
      return fetch(fetchUrl, {
        method,
        headers: method.toUpperCase() !== "GET"
          ? { "Content-Type": "application/x-www-form-urlencoded" }
          : {},
        body: method.toUpperCase() !== "GET" ? qs : undefined,
      })
        .then((r) => r.text())
        .then((text) => {
          try { return JSON.parse(text); } catch { return text === "true"; }
        });
    },
  };

  // ─── Výchozí zprávy (fallback — přepisuje je aktivní locale) ───────────────

  const builtinMessages = {
    required:     "This field is required.",
    remote:       "Please fix this field.",
    email:        "Please enter a valid email address.",
    url:          "Please enter a valid URL.",
    date:         "Please enter a valid date.",
    dateISO:      "Please enter a valid date (ISO format YYYY-MM-DD).",
    number:       "Please enter a valid number.",
    digits:       "Please enter only digits.",
    creditcard:   "Please enter a valid credit card number.",
    equalTo:      "Please enter the same value again.",
    maxlength:    "Please enter no more than {0} characters.",
    minlength:    "Please enter at least {0} characters.",
    rangelength:  "Please enter a value between {0} and {1} characters long.",
    range:        "Please enter a value between {0} and {1}.",
    max:          "Please enter a value less than or equal to {0}.",
    min:          "Please enter a value greater than or equal to {0}.",
    step:         "Please enter a multiple of {0}.",
    pattern:      "Please check this field.",
  };

  // Aktivní zprávy — výchozí jsou builtinMessages, přepisují se přes setLocale()
  let defaultMessages = Object.assign({}, builtinMessages);

  // ─── i18n ─────────────────────────────────────────────────────────────────

  const locales = {};

  /**
   * Zaregistruje jazykový balíček.
   * @param {string} code  - kód jazyka, např. "cs", "en", "de"
   * @param {object} messages - objekt se zprávami (stejná struktura jako defaultMessages)
   */
  function addLocale(code, messages) {
    locales[code] = messages;
  }

  /**
   * Aktivuje zaregistrovaný jazykový balíček.
   * @param {string} code - kód jazyka
   */
  function setLocale(code) {
    if (!locales[code]) {
      console.warn(`validate.js: locale "${code}" není registrována. Použij validate.addLocale() nejdřív.`);
      return;
    }
    defaultMessages = Object.assign({}, builtinMessages, locales[code]);
  }

  // ─── Formátování zpráv ─────────────────────────────────────────────────────

  function formatMessage(tpl, params) {
    if (Array.isArray(params)) {
      return tpl.replace(/\{(\d+)\}/g, (_, i) => params[i] ?? "");
    }
    return tpl.replace(/\{0\}/g, params ?? "");
  }

  // ─── Pomocné funkce ────────────────────────────────────────────────────────

  function getValue(el) {
    if (el.type === "checkbox") return el.checked ? el.value : "";
    if (el.type === "radio") {
      const checked = (el.form || document).querySelector(
        `input[type="radio"][name="${CSS.escape(el.name)}"]:checked`
      );
      return checked ? checked.value : "";
    }
    return el.value;
  }

  function isIgnored(el, ignoreSelector) {
    if (!ignoreSelector) return false;
    try { return el.matches(ignoreSelector); } catch { return false; }
  }

  function getFormElements(form) {
    return Array.from(form.elements).filter(
      (el) =>
        el.name &&
        !el.disabled &&
        ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName) &&
        el.type !== "submit" &&
        el.type !== "reset" &&
        el.type !== "button" &&
        el.type !== "image"
    );
  }

  // ─── Továrna validátoru ────────────────────────────────────────────────────

  function createValidator(formEl, options) {
    formEl.setAttribute("novalidate", "");
    const opts = Object.assign(
      {
        rules: {},
        messages: {},
        ignore: ":hidden",
        errorClass: "error",
        validClass: "valid",
        errorElement: "label",
        focusInvalid: true,
        focusCleanup: false,
        onsubmit: true,
        onfocusout: true,
        onkeyup: true,
        onclick: true,
        submitHandler: null,
        invalidHandler: null,
        errorPlacement: null,
        highlight: null,
        unhighlight: null,
        success: null,
        showErrors: null,
        normalizer: null,
        groups: {},
        debug: false,
      },
      options
    );

    function normalizeRule(rule) {
      if (typeof rule === "string") return { [rule]: true };
      if (typeof rule === "boolean" || typeof rule === "number") return {};
      return rule || {};
    }

    function getRulesForElement(el) {
      const userRules = normalizeRule(opts.rules[el.name]);
      const html5 = {};
      if (el.required) html5.required = true;
      if (el.classList.contains("required")) html5.required = true;
      if (el.type === "email") html5.email = true;
      if (el.type === "url") html5.url = true;
      if (el.type === "number") html5.number = true;
      if (el.hasAttribute("min")) html5.min = el.getAttribute("min");
      if (el.hasAttribute("max")) html5.max = el.getAttribute("max");
      if (el.step && el.step !== "any") html5.step = el.step;
      if (el.minLength > 0) html5.minlength = el.minLength;
      if (el.maxLength >= 0 && el.maxLength < 524288) html5.maxlength = el.maxLength;
      if (el.pattern) html5.pattern = el.pattern;
      return Object.assign({}, html5, userRules);
    }

    function getMessageForRule(el, ruleName, param) {
      const userMsg = opts.messages[el.name];
      if (userMsg) {
        const msg = typeof userMsg === "string" ? userMsg : userMsg[ruleName];
        if (msg) return typeof msg === "function" ? msg(param) : msg;
      }
      const tpl = defaultMessages[ruleName] || "This field is invalid.";
      return formatMessage(tpl, param);
    }

    const errorMap   = {};
    const errorList  = [];
    const submitted  = {};

    function getOrCreateError(el) {
      let label = formEl.querySelector(`[data-vfor="${CSS.escape(el.name)}"]`);
      if (!label) {
        label = document.createElement(opts.errorElement);
        label.setAttribute("data-vfor", el.name);
        label.className = opts.errorClass;
        if (el.id) label.setAttribute("for", el.id);
        if (opts.errorPlacement) {
          opts.errorPlacement(label, el);
        } else {
          el.insertAdjacentElement("afterend", label);
        }
      }
      return label;
    }

    function showError(el, message) {
      const label = getOrCreateError(el);
      label.textContent = message;
      label.style.display = "";

      if (opts.highlight) {
        opts.highlight.call(validator, el, opts.errorClass, opts.validClass);
      } else {
        el.classList.add(opts.errorClass);
        el.classList.remove(opts.validClass);
      }
    }

    function clearError(el) {
      const label = formEl.querySelector(`[data-vfor="${CSS.escape(el.name)}"]`);
      if (label) {
        if (typeof opts.success === "string") {
          label.className = opts.success;
          label.textContent = "";
        } else if (typeof opts.success === "function") {
          opts.success(label, el);
        } else {
          label.style.display = "none";
          label.textContent = "";
        }
      }

      if (opts.unhighlight) {
        opts.unhighlight.call(validator, el, opts.errorClass, opts.validClass);
      } else {
        el.classList.remove(opts.errorClass);
        el.classList.add(opts.validClass);
      }
    }

    async function validateElement(el) {
      if (isIgnored(el, opts.ignore)) return true;

      const rules = getRulesForElement(el);
      let value   = getValue(el);
      if (opts.normalizer) value = opts.normalizer.call(el, value);

      const isEmpty = value.trim() === "";
      if (isEmpty && !rules.required) {
        clearError(el);
        return true;
      }

      for (const [ruleName, param] of Object.entries(rules)) {
        const method = methods[ruleName];
        if (!method) continue;

        let result = method(value, el, param);

        if (result instanceof Promise) {
          try { result = await result; } catch { result = false; }
        }

        if (!result) {
          const message = getMessageForRule(el, ruleName, param);
          showError(el, message);
          return false;
        }
      }

      clearError(el);
      return true;
    }

    async function validateForm() {
      const elements = getFormElements(formEl);

      errorList.length = 0;
      for (const k in errorMap) delete errorMap[k];

      const results = await Promise.all(elements.map((el) => validateElement(el)));
      results.forEach((ok, i) => {
        if (!ok) {
          const el  = elements[i];
          const lbl = formEl.querySelector(`[data-vfor="${CSS.escape(el.name)}"]`);
          const msg = lbl ? lbl.textContent : "";
          errorMap[el.name] = msg;
          errorList.push({ element: el, message: msg });
        }
      });

      if (opts.showErrors) {
        opts.showErrors.call(validator, { ...errorMap }, [...errorList]);
      }

      return errorList.length === 0;
    }

    // ── Eventy ───────────────────────────────────────────────────────────────

    if (opts.onsubmit) {
      formEl.addEventListener("submit", async function (e) {
        e.preventDefault();
        const valid = await validateForm();
        if (valid) {
          if (opts.submitHandler) {
            opts.submitHandler.call(validator, formEl, e);
          } else {
            formEl.submit();
          }
        } else {
          if (opts.invalidHandler) {
            opts.invalidHandler.call(validator, e, validator);
          }
          if (opts.focusInvalid && errorList.length) {
            errorList[0].element.focus();
          }
        }
      });
    }

    if (opts.onfocusout) {
      formEl.addEventListener("focusout", function (e) {
        const el = e.target;
        if (el.name && !isIgnored(el, opts.ignore)) {
          submitted[el.name] = true;
          validateElement(el);
        }
      });
    }

    if (opts.onkeyup) {
      formEl.addEventListener("keyup", function (e) {
        const el = e.target;
        if (el.name && submitted[el.name] && !isIgnored(el, opts.ignore)) {
          validateElement(el);
        }
      });
    }

    if (opts.onclick) {
      formEl.addEventListener("click", function (e) {
        const el = e.target;
        if (el.name && (el.type === "checkbox" || el.type === "radio") && !isIgnored(el, opts.ignore)) {
          submitted[el.name] = true;
          validateElement(el);
        }
      });
    }

    // ── Veřejné API ──────────────────────────────────────────────────────────

    const validator = {
      form:             () => validateForm(),
      element:          (el) => validateElement(typeof el === "string" ? formEl.querySelector(el) : el),
      numberOfInvalids: () => Object.keys(errorMap).length,
      errorMap:         () => ({ ...errorMap }),
      errorList:        () => [...errorList],

      resetForm() {
        getFormElements(formEl).forEach((el) => {
          clearError(el);
          el.classList.remove(opts.errorClass, opts.validClass);
        });
        for (const k in errorMap) delete errorMap[k];
        errorList.length = 0;
        for (const k in submitted) delete submitted[k];
      },

      rules(el, action, rules) {
        const node = typeof el === "string" ? formEl.querySelector(el) : el;
        if (!node) return;
        if (action === "add") {
          opts.rules[node.name] = Object.assign(normalizeRule(opts.rules[node.name]), rules);
        } else if (action === "remove") {
          const current = normalizeRule(opts.rules[node.name]);
          if (rules) {
            (Array.isArray(rules) ? rules : [rules]).forEach((r) => delete current[r]);
          } else {
            opts.rules[node.name] = {};
          }
        }
      },

      messages(el, msgs) {
        const node = typeof el === "string" ? formEl.querySelector(el) : el;
        if (!node) return;
        opts.messages[node.name] = Object.assign(opts.messages[node.name] || {}, msgs);
      },

      destroy() {
        formEl.querySelectorAll("[data-vfor]").forEach((el) => el.remove());
      },

      addMethod,
    };

    return validator;
  }

  // ─── Statické metody ───────────────────────────────────────────────────────

  function addMethod(name, fn, message) {
    methods[name] = fn;
    if (message) defaultMessages[name] = message;
  }

  function validate(formOrSelector, options) {
    const formEl =
      typeof formOrSelector === "string"
        ? document.querySelector(formOrSelector)
        : formOrSelector;

    if (!formEl) {
      console.warn("validate.js: form not found:", formOrSelector);
      return null;
    }

    return createValidator(formEl, options || {});
  }

  validate.addMethod    = addMethod;
  validate.addLocale    = addLocale;
  validate.setLocale    = setLocale;
  validate.locales      = locales;
  validate.methods      = methods;
  validate.messages     = defaultMessages;
  validate.defaults     = {};

  return validate;
});
