import {describe, it, expect} from 'vitest'
import {createForm} from '../src/main'
import FormWrapper from '../src/main'
import {Form} from '../src/core/Form'

describe('createForm', () => {
    it('creates a Form instance', () => {
        const form = createForm({name: null})
        expect(form).toBeInstanceOf(Form)
    })

    it('initializes fields from data', () => {
        const form = createForm({a: 1, b: 2})
        expect(form.a).toBe(1)
        expect(form.b).toBe(2)
    })
})

describe('default export (FormWrapper)', () => {
    it('is the Form class', () => {
        expect(FormWrapper).toBe(Form)
    })
})
