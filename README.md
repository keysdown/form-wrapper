<h1 align="center">
  Form Wrapper
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@keysdown/form-wrapper" target="_blank">
    <img src="https://img.shields.io/npm/v/@keysdown/form-wrapper.svg?style=shield" alt="npm"/>
  </a>
  <img src="https://img.shields.io/github/license/keysdown/form-wrapper.svg" alt="MIT"/>
</p>

> A zero-dependency, framework-agnostic form state management library with a plugin-based validation system. Manage form fields, validate with customizable error messages, and extend with built-in validation rules, only importing what you need.

<p align="center">
  <strong>Bundle size (minified + gzip):</strong> ~1.5 kB core / ~3 kB with all 33 rules
</p>

## Installation

```shell
npm install @keysdown/form-wrapper --save
```

## Importing

```js
import {createForm} from '@keysdown/form-wrapper'

const form = ref(createForm({
    first_name: null,
    last_name: null,
    username: null
}))

// Or

import FormWrapper from '@keysdown/form-wrapper'

const form = ref(new FormWrapper({
    first_name: null,
    last_name: null,
    username: null
}))
```

## Validation Plugins

Validation rules are loaded via a plugin system, no rules are bundled in core. This keeps the base library minimal and lets you import only what you need.

### Loading all rules

Use the `formValidation` plugin to register all 33 validation rules at once:

```js
import FormWrapper from '@keysdown/form-wrapper'
import formValidation from '@keysdown/form-wrapper/plugins/formValidation'

FormWrapper.extend(formValidation)
```

### Default error messages with locales

Validation rules have built-in default error messages. By default, messages are in **English**. You can change the language by loading a locale:

```js
import FormWrapper from '@keysdown/form-wrapper'
import formValidation from '@keysdown/form-wrapper/plugins/formValidation'
import pt from '@keysdown/form-wrapper/plugins/locales/pt'

FormWrapper.extend(formValidation)
FormWrapper.locale(pt) // switch to Portuguese
```

Available locales: `en` (English, default), `pt` (Portuguese), `es` (Spanish).

Default messages support **interpolation**, placeholders like `:field`, `:min`, `:max`, `:size`, `:digits`, `:other`, `:values` are replaced with actual values:

```
The first name field is required.
The password must be at least 6.
```

### Custom field display names with `attribute`

By default, the `:field` placeholder uses the field name with underscores replaced by spaces (e.g., `first_name` → "first name"). You can customize this with the `attribute` property:

```js
const form = new FormWrapper({
    email: {
        value: null,
        validation: {
            rules: ['required', 'email']
        },
        attribute: 'contact email'
    }
})

// Default error message would show:
// "The contact email field is required."
// instead of "The email field is required."
```

```js
const form = new FormWrapper({
    password: {
        value: null,
        validation: {
            rules: ['required', 'min:8']
        },
        attribute: 'senha'
    }
})

// With pt locale: "O campo senha deve ter no mínimo 8."
```

User-provided messages always **override** default messages:

```js
const form = new FormWrapper({
    email: {
        value: null,
        validation: {
            rules: ['required', 'email'],
            messages: {
                required: 'Email is required.' // overrides the default message
                // email uses the default locale message
            }
        }
    }
})
```

### Tree-shaking individual rules

Import only the rules you need and use them directly in the `rules` array for tree-shaking:

```js
import FormWrapper from '@keysdown/form-wrapper'
import { required, email } from '@keysdown/form-wrapper/plugins/rules'

const form = new FormWrapper({
    email: {
        value: null,
        validation: {
            rules: [required, email],
            messages: {
                required: 'The email field is required.',
                email: 'The email must be a valid address.'
            }
        }
    }
})
```

You can also mix function rules with string rules (useful for parameterized rules like `min:6`):

```js
import { required, email } from '@keysdown/form-wrapper/plugins/rules'

rules: [required, email, 'min:6']
```

### Custom rules

Add inline validation rules directly in the `rules` array. A custom rule receives a destructured object `{value, fail, form, field}`:

```js
const form = createForm({
    email: {
        value: null,
        validation: {
            rules: [({value, fail}) => {
                if (!value) fail('The email field is required.')
            }]
        }
    }
})
```

Access other form fields via the `form` parameter:

```js
const form = createForm({
    password: { value: null, validation: {rules: []} },
    password_confirmation: {
        value: null,
        validation: {
            rules: [({value, fail, form}) => {
                if (value !== form.password) fail('Passwords do not match.')
            }]
        }
    }
})
```

Custom rules support **async** validation (e.g., API calls):

```js
const form = createForm({
    email: {
        value: null,
        validation: {
            rules: [async ({value, fail}) => {
                const response = await fetch(`/api/check-email?email=${encodeURIComponent(value)}`)
                const { available } = await response.json()
                if (!available) fail('This email is already taken.')
            }]
        }
    }
})
```

You can mix custom rules with built-in rules:

```js
import { required, email } from '@keysdown/form-wrapper/plugins/rules'

const form = createForm({
    email: {
        value: null,
        validation: {
            rules: [
                required,
                email,
                async ({value, fail}) => {
                    const response = await fetch(`/api/check-email?email=${encodeURIComponent(value)}`)
                    const { available } = await response.json()
                    if (!available) fail('This email is already taken.')
                }
            ],
            messages: {
                required: 'The email field is required.',
                email: 'The email must be a valid address.'
            }
        }
    }
})
```

### Static methods on FormWrapper

| Method | Description |
|---|---|
| `FormWrapper.extend(plugin)` | Register a plugin (e.g., `formValidation`) |
| `FormWrapper.addRule(name, handler)` | Register a single validation rule |
| `FormWrapper.locale(locale)` | Set the default error messages locale |
| `FormWrapper.rules` | Static rule registry |
| `FormWrapper.defaultMessages` | Static default messages registry |

## Basic example

Basic example using Vue.

```vue
<template>
  <form @submit.prevent="submit">
    <input type="text" v-model="form.first_name"/>
    <input type="text" v-model="form.last_name"/>
    <input type="text" v-model="form.username"/>
    <button type="submit" :disabled="form.awaiting"/>
  </form>
</template>

<script setup lang="ts">
  import axios from 'axios'
  import {ref} from 'vue'
  import {createForm} from '@keysdown/form-wrapper'

  const form = ref(createForm({
    first_name: null,
    last_name: null,
    username: null
  }))

  const submit = () => {
    form.value.setAwaiting(true)

    axios.post('some-api', form.value.values())
        .then(({data}) => {
          form.value.reset()

          // ...
        })
        .catch(({errors}) => {
          form.value.errors.fill(errors)
          
          form.value.setAwaiting(false)
        })
  }
</script>
```

## Basic example with validation

Basic example with validation using Vue.

```vue
<template>
  <form @submit.prevent="submit">
    <input type="text" v-model="form.first_name"/>
    <input type="text" v-model="form.last_name"/>
    <input type="text" v-model="form.username"/>
    <button type="submit" :disabled="form.awaiting"/>
  </form>
</template>

<script setup lang="ts">
  import axios from 'axios'
  import {ref} from 'vue'
  import FormWrapper from '@keysdown/form-wrapper'
  import formValidation from '@keysdown/form-wrapper/plugins/formValidation'

  FormWrapper.extend(formValidation)

  const form = ref(new FormWrapper({
    first_name: {
      value: null,
      validation: {
        rules: ['required'],
        messages: {
          required: 'The first name field is required.'
        }
      }
    },
    last_name: {
      value: null,
      validation: {
        rules: ['required'],
        messages: {
          required: 'The last name field is required.'
        }
      }
    },
    username: {
      value: null,
      validation: {
        rules: ['required', 'min:6'],
        messages: {
          required: 'The username field is required.',
          min: 'The username field must have at least 6 characters'
        }
      }
    }
  }))

  const submit = () => {
    form.value.validate()
        .then((form) => {
          form.setAwaiting(true)

          axios.post('some-api', form.values())
              .then(({data}) => {
                form.reset()

                // ...
              })
              .catch(({errors}) => {
                form.errors.fill(errors)

                form.setAwaiting(false)
              })
        })
        .catch((form) => {
          console.log('error')
        })
  }
</script>
```

## Form methods

### addField(field, value)

Method used to add a single field to the form.

```js
form.addField('username', null)

form.addField('username', {
    value: null,
    validation: {
        rules: ['required'],
        messages: {
            required: 'The username field is required.'
        }
    }
})
```

### addFields(fields)

Method used to add multiple fields to the form.

```js
form.addFields({
    full_name: null,
    username: null
})

form.addFields({
    full_name: {
        value: null,
        validation: {
            rules: ['required'],
            messages: {
                required: 'The full name field is required.'
            }
        }
    },
    username: {
        value: null,
        validation: {
            rules: ['required'],
            messages: {
                required: 'The username field is required.'
            }
        }
    }
})
```

### fill(data, updateOriginalValues = false)

Method used when you want to fill in several form fields at once.

```js
const form = createForm({
    username: null
})

console.log(form.values()) // {username: null}

form.fill({
    username: 'keysdown'
})

console.log(form.values()) // {username: 'keysdown'}
```

### removeField(field)

Method used when you want to remove a field from the form.

```js
const form = createForm({
    username: null
})

console.log(form.values()) // {username: null}

form.removeField('username')

console.log(form.values()) // {}
```

### removeFields(fields)

Method used to remove multiple fields to the form.

```js
const form = createForm({
    username: null
})

console.log(form.values()) // {username: null}

form.removeFields(['username'])

console.log(form.values()) // {}
```

### reset()

Method used to reset all form values to original state.

```js
const form = createForm({
    username: null
})

form.username = 'keysdown'

console.log(form.values()) // {username: 'keysdown'}

form.reset()

console.log(form.values()) // {username: null}
```

### wasChanged(field)

Method used to check if one or more fields have been changed from their original values. When an array is provided, returns `true` if **any** of the fields were changed.

```js
const form = createForm({
    name: null,
    username: null
})

console.log(form.wasChanged('username')) // false

form.username = 'keysdown'

console.log(form.wasChanged('username')) // true

console.log(form.wasChanged(['name', 'username'])) // true (any changed)
```

### filled(field)

Method used to check if one or more fields are filled (not `null`, not `undefined`, not empty string `''`). When an array is provided, returns `true` only if **all** fields are filled.

```js
const form = createForm({
    name: null,
    username: null
})

form.username = 'keysdown'

console.log(form.filled('username')) // true

console.log(form.filled('name')) // false

console.log(form.filled(['name', 'username'])) // false (name is not filled)
```

### setAwaiting(awaiting = true)

Method used to change the form loading state.

```js
const form = createForm({
    username: null
})

console.log(form.awaiting) // false

form.setAwaiting()

console.log(form.awaiting) // true

form.setAwaiting(false)

console.log(form.awaiting) // false
```

### validate(field = null)

Method used to validate the entire form or a specific field.

```js
const form = createForm({
    username: {
        value: null,
        validation: {
            rules: ['required'],
            messages: {
                required: 'The username field is required.'
            }
        }
    }
})

form.validate('username')
    .then(() => {
        //...
    })
    .catch(() => {
        //...
    })

form.validate()
    .then((form) => {
        form.setAwaiting(true)

        // ...
    })
    .catch((form) => {
        console.log('error')
    })
```

### validateField(field)

Method used to validate a specific field.

```js
const form = createForm({
    username: {
        value: null,
        validation: {
            rules: ['required'],
            messages: {
                required: 'The username field is required.'
            }
        }
    }
})

form.validateField('username')
    .then(() => {
        //...
    })
    .catch(() => {
        //...
    })

// Same as:

form.validate('username')
    .then(() => {
        //...
    })
    .catch(() => {
        //...
    })
```

### validateForm()

Method used to validate the entire form.

```js
const form = createForm({
    username: {
        value: null,
        validation: {
            rules: ['required'],
            messages: {
                required: 'The username field is required.'
            }
        }
    }
})

form.validateForm()
    .then((form) => {
        //...
    })
    .catch((form) => {
        //...
    })

// Same as:

form.validate()
    .then((form) => {
        form.setAwaiting(true)

        // ...
    })
    .catch((form) => {
        console.log('error')
    })
```

### values()

Method used to access all form values in json format.

```js
const form = createForm({
    username: null
})

form.username = 'keysdown'

axios.post('some-api', form.values())
```

#### Filtering values

It is also possible to filter all accessed form values.

```js
const form = createForm({
    first_name: null,
    last_name: null
})

form.first_name = 'keysdown'

axios.post('some-api', form.values(['first_name']))
```

### filledValues()

Method used to access form values, excluding fields with `null` or `undefined` values.

```js
const form = createForm({
    username: null,
    email: null,
    role: 'admin'
})

form.username = 'keysdown'

axios.post('some-api', form.filledValues())
// sends { username: 'keysdown', role: 'admin' }
```

Note that `0`, `false`, and `''` (empty string) are considered filled values and will be included.

#### Filtering values

It is also possible to filter which fields are considered.

```js
const form = createForm({
    first_name: null,
    last_name: null,
    role: 'admin'
})

form.first_name = 'keysdown'

axios.post('some-api', form.filledValues(['first_name', 'last_name']))
// sends { first_name: 'keysdown' }
```

### valuesAsFormData()

Method used to access all form values as form data.

```js
const form = createForm({
    username: null
})

form.username = 'keysdown'

axios.post('some-api', form.valuesAsFormData(), {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
```

#### Filtering values

It is also possible to filter all accessed form values.

```js
const form = createForm({
    first_name: null,
    last_name: null
})

form.first_name = 'keysdown'

axios.post('some-api', form.valuesAsFormData(['first_name']))
```

## Validation

There is a property in the form object dedicated to validations, you can access everything related to validations through the `validation` property:

```js
form.validation.errors.all()

form.validation.messages.all()

form.validation.rules.all()
```

You can also use the following shortcuts:

```js
form.errors.all()

form.messages.all()

form.rules.all()
```

### Validation collections

Both errors, messages and rules work using collections, the methods for managing collections are as follows:

#### all()

Returns all items in the collection.

```js
form.errors.all()
form.messages.all()
form.rules.all()
```

#### first(key)

Returns the first item in the collection.

```js
form.errors.first('username')
form.messages.first('username')
form.rules.first('username')
```

#### get(key)

Returns the value for the given key, or `null` if not found.

```js
form.errors.get('username')
form.messages.get('username')
form.rules.get('username')
```

#### any()

Returns true if the collection has any items and false if it is empty.

```js
form.errors.any()
form.messages.any()
form.rules.any()
```

#### fill(items)

Inserts values into a collection, replacing any previous values.

```js
form.errors.fill({
    username: [
        'The username field is required.'
    ]
})

form.messages.fill({
    username: {
        required: 'The username field is required.'
    }
})

form.rules.fill({
    username: ['required']
})
```

#### push(key, data)

Inserts a single value into an item in a collection.

```js
form.errors.push('username', 'The username field is required.')

form.messages.push('username', {
    required: 'The username field is required.'
})

form.rules.push('username', ['required'])
```

#### has(key)

Checking if the collection has an item with the key. Accepts a single key or an array of keys. When an array is provided, returns `true` if **any** of the keys exist.

```js
form.errors.has('username')
form.errors.has(['username', 'email'])
form.messages.has('username')
form.rules.has('username')
```

#### unset(key)

Remove an item from the collection.

```js
form.errors.unset('username')
form.messages.unset('username')
form.rules.unset('username')
```

#### clear()

Clears the entire collection, making it empty.

```js
form.errors.clear()
form.messages.clear()
form.rules.clear()
```

### Validation rules

The `formValidation` plugin provides 33 validation rules. Rules are loaded via plugins, see [Validation Plugins](#validation-plugins) for setup instructions.

| Rule | Parameters | Description |
|---|---|---|
| `required` | — | Field must be present and not empty |
| `email` | — | Must be a valid email address |
| `url` | — | Must be a valid URL |
| `min` | `min:6` | Minimum length (string) or value (number) or count (array) |
| `max` | `max:255` | Maximum length/value/count |
| `between` | `between:1,10` | Between min and max |
| `size` | `size:10` | Exact length/value/count |
| `alpha` | — | Only alphabetic characters |
| `alphaNumeric` | — | Only letters and numbers |
| `string` | — | Must be a string |
| `integer` | — | Must be an integer |
| `numeric` | — | Must be numeric |
| `array` | — | Must be an array |
| `boolean` | — | Must be boolean (true, false, 0, 1, '0', '1') |
| `date` | — | Must be a valid date |
| `same` | `same:field` | Must match another field |
| `different` | `different:field` | Must differ from another field |
| `confirmed` | `confirmed:field` | Must match field_confirmation |
| `in` | `in:admin,user` | Value must be in list |
| `notIn` | `notIn:admin,user` | Value must not be in list |
| `regex` | `regex:/pattern/` | Must match regex pattern |
| `startsWith` | `startsWith:foo,bar` | Must start with one of the values |
| `endsWith` | `endsWith:foo,bar` | Must end with one of the values |
| `digits` | `digits:4` | Must have exactly N digits |
| `digitsBetween` | `digitsBetween:3,6` | Must have between min and max digits |
| `ip` | — | Must be a valid IP (v4 or v6) |
| `json` | — | Must be a valid JSON string |
| `uuid` | — | Must be a valid UUID |
| `lessThan` | `lessThan:field` | Numeric value less than another field |
| `greaterThan` | `greaterThan:field` | Numeric value greater than another field |
| `lessThanOrEqual` | `lessThanOrEqual:field` | Less than or equal to another field |
| `greaterThanOrEqual` | `greaterThanOrEqual:field` | Greater than or equal to another field |
| `nullable` | — | Allows null/empty (always passes) |

## License

[MIT](LICENSE)
