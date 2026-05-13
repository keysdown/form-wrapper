import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {Form} from '../../src/core/Form'
import formValidation from '../../src/plugins/formValidation'

describe('formValidation plugin', () => {
    beforeEach(() => {
        Form.rules = {}
    })

    afterEach(() => {
        Form.rules = {}
    })

    it('registers all validation rules', () => {
        Form.extend(formValidation)

        expect(Object.keys(Form.rules).length).toBe(33)
    })

    it('registers specific rules', () => {
        Form.extend(formValidation)

        const expectedRules = [
            'required', 'email', 'url', 'min', 'max', 'between', 'size',
            'alpha', 'alphaNumeric', 'string', 'integer', 'numeric',
            'array', 'boolean', 'date', 'same', 'different', 'confirmed',
            'in', 'notIn', 'regex', 'startsWith', 'endsWith',
            'digits', 'digitsBetween', 'ip', 'json', 'uuid',
            'lessThan', 'greaterThan', 'lessThanOrEqual', 'greaterThanOrEqual',
            'nullable'
        ]

        expectedRules.forEach(rule => {
            expect(rule in Form.rules).toBe(true)
            expect(typeof Form.rules[rule]).toBe('function')
        })
    })

    it('allows validation with registered rules', async () => {
        Form.extend(formValidation)

        const form = new Form({
            name: {value: null, validation: {rules: ['required'], messages: {required: 'Required'}}}
        })

        await expect(form.validateField('name')).rejects.toBeUndefined()
        expect(form.errors.get('name')).toContain('Required')
    })

    it('allows validation with multiple rules', async () => {
        Form.extend(formValidation)

        const form = new Form({
            email: {
                value: 'invalid',
                validation: {
                    rules: ['required', 'email'],
                    messages: {required: 'Required', email: 'Invalid email'}
                }
            }
        })

        await expect(form.validateField('email')).rejects.toBeUndefined()
        expect(form.errors.get('email')).toContain('Invalid email')
    })

    it('does not overwrite existing custom rules', () => {
        const customHandler = async (value: any) => value
        Form.rules['custom'] = customHandler

        Form.extend(formValidation)

        expect(Form.rules['custom']).toBe(customHandler)
    })
})
