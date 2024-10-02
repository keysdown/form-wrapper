<h1 align="center">
  Form Wrapper (Beta)
</h1>

> A package that allows you to easily manage forms, with Form Wrapper it is possible to perform validations with error messages, in addition to managing the state of the forms.

> This package is currently in Beta and is being tested in live applications, feel free to help in the development and maturation of the package.

## Installation

```shell
npm install @keysdown/form-wrapper --save
```

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
  import Form from '@keysdown/form-wrapper'

  const form = ref(Form({
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
  import Form from '@keysdown/form-wrapper'

  const form = ref(Form({
    first_name: {
      value: null,
      rules: ['required'],
      messages: {
        required: 'The first name field is required.'
      }
    },
    last_name: {
      value: null,
      rules: ['required'],
      messages: {
        required: 'The last name field is required.'
      }
    },
    username: {
      value: null,
      rules: ['required', 'min:6'],
      messages: {
        required: 'The username field is required.',
        min: 'The username field must have at least 6 characters'
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
        validation: {
            rules: ['required'],
            messages: {
                required: 'The full name field is required.'
            }
        }
    },
    username: {
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
const form = Form({
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
const form = Form({
    username: null
})

console.log(form.values()) // {username: null}

form.removeField('username')

console.log(form.values()) // {}
```

### removeFields(fields)

Method used to remove multiple fields to the form.

```js
const form = Form({
    username: null
})

console.log(form.values()) // {username: null}

form.removeFields(['username'])

console.log(form.values()) // {}
```

### reset()

Method used to reset all form values to original state.

```js
const form = Form({
    username: null
})

form.username = 'keysdown'

console.log(form.values()) // {username: 'keysdown'}

form.reset()

console.log(form.values()) // {username: null}
```

### setAwaiting(awaiting = true)

Method used to change the form loading state.

```js
const form = Form({
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
 const form = Form({
    username: {
        value: null,
        rules: ['required'],
        messages: {
            required: 'The username field is required.'
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
 const form = Form({
    username: {
        value: null,
        rules: ['required'],
        messages: {
            required: 'The username field is required.'
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
 const form = Form({
    username: {
        value: null,
        rules: ['required'],
        messages: {
            required: 'The username field is required.'
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
 const form = Form({
    username: null
})

form.username = 'keysdown'

axios.post('some-api', form.values())
```

### valuesAsFormData()

Method used to access all form values as form data.

```js
 const form = Form({
    username: null
})

form.username = 'keysdown'

axios.post('some-api', form.valuesAsFormData(), {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
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

form.rules.push('username', 'required')
```

#### has(key)

Checking if the collection has an item with the key.

```js
form.errors.has('username')
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

#### clear(key)

Clears the entire collection, making it empty.

```js
form.errors.clear()
form.messages.clear()
form.rules.clear()
```

### Validation rules

There are some predefined validation rules that you can use in the form:

#### required

Used when a field is required