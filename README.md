# validate.js

**Vanilla JS form validation** — jQuery Validation Plugin compatible syntax, zero dependencies.

[![npm](https://img.shields.io/npm/v/@partyk/validate.js)](https://www.npmjs.com/package/@partyk/validate.js)
[![license](https://img.shields.io/npm/l/@partyk/validate.js)](LICENSE)
[![size](https://img.shields.io/badge/minzipped-~4kb-blue)](dist/validate.min.js)

Drop-in replacement for [jQuery Validation Plugin](https://jqueryvalidation.org/) — same `rules`, `messages`, `submitHandler` and all other options, no jQuery required.

---

## Installation

```bash
npm install @partyk/validate.js
```

Or via CDN:

```html
<script src="https://unpkg.com/@partyk/validate.js/dist/validate.min.js"></script>
```

---

## Quick start

```html
<form id="myForm">
  <input type="text" name="username">
  <input type="email" name="email">
  <button type="submit">Submit</button>
</form>

<script src="validate.min.js"></script>
<script>
  validate('#myForm', {
    rules: {
      username: { required: true, minlength: 3 },
      email:    { required: true, email: true },
    },
    messages: {
      username: { required: 'Username is required.', minlength: 'At least 3 characters.' },
      email:    'Please enter a valid email.',
    },
    submitHandler(form) {
      console.log('Valid! Submitting…', form);
    }
  });
</script>
```

### ES Module

```js
import validate from '@partyk/validate.js';

validate('#myForm', { rules: { ... } });
```

### HTMLFormElement shorthand

```js
document.querySelector('#myForm').validate({ rules: { ... } });
```

---

## Options

All options mirror the jQuery Validation Plugin API.

| Option | Type | Default | Description |
|---|---|---|---|
| `rules` | `object` | `{}` | Validation rules per field name |
| `messages` | `object` | `{}` | Custom error messages per field/rule |
| `ignore` | `string` | `":hidden"` | CSS selector — matching fields are skipped |
| `errorClass` | `string` | `"error"` | CSS class added to invalid inputs |
| `validClass` | `string` | `"valid"` | CSS class added to valid inputs |
| `errorElement` | `string` | `"label"` | HTML tag used for error messages |
| `errorPlacement` | `function` | — | `(errorEl, inputEl)` — custom error placement |
| `highlight` | `function` | — | `(inputEl, errorClass, validClass)` — custom highlight |
| `unhighlight` | `function` | — | `(inputEl, errorClass, validClass)` — custom unhighlight |
| `success` | `function\|string` | — | Called/applied when field becomes valid |
| `submitHandler` | `function` | — | `(form, event)` — called on valid submit |
| `invalidHandler` | `function` | — | `(event, validator)` — called on invalid submit |
| `showErrors` | `function` | — | `(errorMap, errorList)` — custom error rendering |
| `normalizer` | `function` | — | `(value)` — transform value before validation |
| `focusInvalid` | `boolean` | `true` | Focus first invalid field on submit |
| `onsubmit` | `boolean` | `true` | Validate on submit |
| `onfocusout` | `boolean` | `true` | Validate on focusout |
| `onkeyup` | `boolean` | `true` | Re-validate on keyup (after first error) |
| `onclick` | `boolean` | `true` | Validate checkboxes/radios on click |

---

## Built-in rules

| Rule | Value | Description |
|---|---|---|
| `required` | `true` | Field must not be empty |
| `email` | `true` | Valid email format |
| `url` | `true` | Valid URL |
| `number` | `true` | Valid number |
| `digits` | `true` | Digits only |
| `date` | `true` | Valid date |
| `dateISO` | `true` | ISO date (YYYY-MM-DD) |
| `creditcard` | `true` | Valid credit card (Luhn) |
| `minlength` | `number` | Minimum character count |
| `maxlength` | `number` | Maximum character count |
| `rangelength` | `[min, max]` | Length between min and max |
| `min` | `number` | Minimum numeric value |
| `max` | `number` | Maximum numeric value |
| `range` | `[min, max]` | Value between min and max |
| `step` | `number` | Value must be a multiple |
| `equalTo` | `"#selector"` | Must match another field |
| `pattern` | `RegExp\|string` | Must match regex |
| `remote` | `string\|object` | Async server-side validation |

HTML5 attributes (`required`, `min`, `max`, `step`, `minlength`, `maxlength`, `pattern`, `type="email"`, `type="url"`, `type="number"`) are picked up automatically.

---

## Custom methods

```js
validate.addMethod('phone', function(value) {
  return /^[0-9\s\-\+\(\)]{7,15}$/.test(value);
}, 'Please enter a valid phone number.');

validate('#myForm', {
  rules: { tel: { phone: true } }
});
```

---

## Localization

### Using a bundled locale

```html
<script src="validate.min.js"></script>
<script src="locales/cs.min.js"></script>
<script>
  validate.setLocale('cs');

  validate('#myForm', { rules: { ... } });
</script>
```

### ES Module

```js
import validate from '@partyk/validate.js';
import cs from '@partyk/validate.js/locales/cs.js';

validate.addLocale('cs', cs);
validate.setLocale('cs');
```

### Bundled locales

| Code | Language |
|---|---|
| `en` | English (default) |
| `cs` | Czech |
| `sk` | Slovak |
| `de` | German |

### Adding your own locale

```js
validate.addLocale('fr', {
  required:   'Ce champ est obligatoire.',
  email:      'Veuillez entrer une adresse email valide.',
  minlength:  'Veuillez entrer au moins {0} caractères.',
  // ... all other keys
});

validate.setLocale('fr');
```

The locale file is a plain object with message keys matching the rule names. Use `{0}` and `{1}` as placeholders for rule parameters.

---

## Validator instance API

```js
const v = validate('#myForm', { ... });

await v.form()            // → boolean — validates whole form
await v.element('#email') // → boolean — validates single field
v.resetForm()             // removes all error states
v.numberOfInvalids()      // → number
v.errorMap()              // → { fieldName: "message", ... }
v.errorList()             // → [{ element, message }, ...]
v.rules(el, 'add', { minlength: 5 })   // add rules dynamically
v.rules(el, 'remove', ['minlength'])   // remove rules
v.messages(el, { required: 'Nope.' }) // override messages
v.destroy()               // removes injected error elements
```

---

## Custom error placement

```js
validate('#myForm', {
  errorElement: 'em',
  errorPlacement(error, element) {
    element.closest('fieldset').appendChild(error);
  },
  highlight(element, errorClass, validClass) {
    element.closest('.field').classList.add(errorClass);
  },
  unhighlight(element, errorClass, validClass) {
    element.closest('.field').classList.remove(errorClass);
  },
});
```

---

## Build & publish

```bash
# Install dev dependencies
npm install

# Build (CJS + ESM + locales → dist/)
npm run build

# Minify
npm run minify

# Build + minify in one step
npm run release

# Publish to npm
npm publish --access public
```

---

## License

MIT
