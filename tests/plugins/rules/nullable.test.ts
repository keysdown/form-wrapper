import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {Form} from '../../../src/core/Form'
import nullable from '../../../src/plugins/rules/nullable'
import required from '../../../src/plugins/rules/required'

describe('nullable rule', () => {
    it('always resolves with null', async () => {
        await expect(nullable(null)).resolves.toBe(null)
    })

    it('always resolves with undefined', async () => {
        await expect(nullable(undefined)).resolves.toBe(undefined)
    })

    it('always resolves with empty string', async () => {
        await expect(nullable('')).resolves.toBe('')
    })

    it('always resolves with a string value', async () => {
        await expect(nullable('hello')).resolves.toBe('hello')
    })

    it('always resolves with a number value', async () => {
        await expect(nullable(123)).resolves.toBe(123)
    })
})

describe('nullable short-circuit', () => {
    beforeEach(() => {
        Form.rules = {}
        Form.rules['required'] = required
        Form.rules['nullable'] = nullable
    })

    afterEach(() => {
        Form.rules = {}
    })

    it('skips required when value is null and nullable is present', async () => {
        const form = new Form({
            name: {
                value: null,
                validation: {rules: ['nullable', 'required'], messages: {required: 'Required'}}
            }
        })

        await expect(form.validateField('name')).resolves.toBeUndefined()
        expect(form.errors.has('name')).toBe(false)
    })

    it('skips required when value is undefined and nullable is present', async () => {
        const form = new Form({
            name: {
                value: undefined,
                validation: {rules: ['nullable', 'required'], messages: {required: 'Required'}}
            }
        })

        await expect(form.validateField('name')).resolves.toBeUndefined()
        expect(form.errors.has('name')).toBe(false)
    })

    it('skips required when value is empty string and nullable is present', async () => {
        const form = new Form({
            name: {
                value: '',
                validation: {rules: ['nullable', 'required'], messages: {required: 'Required'}}
            }
        })

        await expect(form.validateField('name')).resolves.toBeUndefined()
        expect(form.errors.has('name')).toBe(false)
    })

    it('still runs required when value is not empty', async () => {
        const form = new Form({
            name: {
                value: 'John',
                validation: {rules: ['nullable', 'required'], messages: {required: 'Required'}}
            }
        })

        await expect(form.validateField('name')).resolves.toBeUndefined()
        expect(form.errors.has('name')).toBe(false)
    })

    it('short-circuits with nullable as function rule', async () => {
        Form.rules = {nullable, required}

        const form = new Form({
            name: {
                value: null,
                validation: {rules: [nullable, 'required'], messages: {required: 'Required'}}
            }
        })

        await expect(form.validateField('name')).resolves.toBeUndefined()
        expect(form.errors.has('name')).toBe(false)
    })

    it('does not short-circuit with nullable function rule when value is not empty', async () => {
        Form.rules = {nullable, required}

        const form = new Form({
            name: {
                value: 'John',
                validation: {rules: [nullable, 'required'], messages: {required: 'Required'}}
            }
        })

        await expect(form.validateField('name')).resolves.toBeUndefined()
        expect(form.errors.has('name')).toBe(false)
    })
})
