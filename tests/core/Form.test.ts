import {describe, it, expect} from 'vitest'
import {Form} from '../../src/core/Form'

const validationField = (value: any, rules: string[], messages: Record<string, string>) => ({
    value,
    validation: {rules, messages}
})

describe('Form', () => {
    describe('constructor', () => {
        it('creates form with simple fields', () => {
            const form = new Form({username: null, email: null})
            expect(form.username).toBeNull()
            expect(form.email).toBeNull()
            expect(form.awaiting).toBe(false)
        })

        it('creates form with default values', () => {
            const form = new Form({name: 'John'})
            expect(form.name).toBe('John')
        })
    })

    describe('addField', () => {
        it('adds a simple field', () => {
            const form = new Form({})
            form.addField('username', null as any)
            expect(form.username).toBeNull()
            expect(form.originalValues['username']).toBeNull()
        })

        it('adds a field with validation config', () => {
            const form = new Form({})
            form.addField('username', validationField(null, ['required'], {required: 'Username is required'}))
            expect(form.username).toBeNull()
            expect(form.rules.has('username')).toBe(true)
            expect(form.messages.has('username')).toBe(true)
        })

        it('preserves File instances as simple values', () => {
            const file = new File(['content'], 'test.txt')
            const form = new Form({})
            form.addField('document', file as any)
            expect(form.document).toBe(file)
        })

        it('handles object value without validation config as simple value', () => {
            const form = new Form({})
            const obj = {random: 'object'}
            form.addField('data', obj as any)
            expect(form.data).toBe(obj)
        })

        it('returns this for chaining', () => {
            const form = new Form({})
            const result = form.addField('a', 1 as any)
            expect(result).toBe(form)
        })
    })

    describe('addFields', () => {
        it('adds multiple simple fields', () => {
            const form = new Form({})
            form.addFields({a: 1, b: 2})
            expect(form.a).toBe(1)
            expect(form.b).toBe(2)
        })

        it('adds multiple fields with validation', () => {
            const form = new Form({})
            form.addFields({
                username: validationField(null, ['required'], {required: 'Required'})
            })
            expect(form.username).toBeNull()
            expect(form.rules.has('username')).toBe(true)
        })

        it('returns this for chaining', () => {
            const form = new Form({})
            expect(form.addFields({x: 1})).toBe(form)
        })
    })

    describe('fill', () => {
        it('fills fields with data', () => {
            const form = new Form({name: null})
            form.fill({name: 'John'})
            expect(form.name).toBe('John')
        })

        it('updates original values when flag is set', () => {
            const form = new Form({name: null})
            form.fill({name: 'John'}, true)
            expect(form.originalValues['name']).toBe('John')
        })

        it('does not update original values by default', () => {
            const form = new Form({name: null})
            form.fill({name: 'John'})
            expect(form.originalValues['name']).toBeNull()
        })

        it('returns this for chaining', () => {
            const form = new Form({})
            expect(form.fill({a: 1})).toBe(form)
        })
    })

    describe('removeField', () => {
        it('removes a field', () => {
            const form = new Form({username: null})
            form.removeField('username')
            expect(form.username).toBeUndefined()
            expect('username' in form.originalValues).toBe(false)
        })

        it('removes associated validation data', () => {
            const form = new Form({
                username: validationField(null, ['required'], {required: 'Required'})
            })
            form.removeField('username')
            expect(form.rules.has('username')).toBe(false)
            expect(form.messages.has('username')).toBe(false)
        })

        it('returns this for chaining', () => {
            const form = new Form({a: 1})
            expect(form.removeField('a')).toBe(form)
        })
    })

    describe('removeFields', () => {
        it('removes multiple fields', () => {
            const form = new Form({a: 1, b: 2, c: 3})
            form.removeFields(['a', 'b'])
            expect(form.a).toBeUndefined()
            expect(form.b).toBeUndefined()
            expect(form.c).toBe(3)
        })

        it('returns this for chaining', () => {
            const form = new Form({a: 1})
            expect(form.removeFields(['a'])).toBe(form)
        })
    })

    describe('reset', () => {
        it('resets values to original state', () => {
            const form = new Form({name: 'original'})
            form.name = 'changed'
            form.reset()
            expect(form.name).toBe('original')
        })

        it('clears errors on reset', () => {
            const form = new Form({name: null})
            form.errors.push('name', 'Some error')
            form.reset()
            expect(form.errors.any()).toBe(false)
        })

        it('returns this for chaining', () => {
            const form = new Form({})
            expect(form.reset()).toBe(form)
        })
    })

    describe('setAwaiting', () => {
        it('sets awaiting to true by default', () => {
            const form = new Form({})
            form.setAwaiting()
            expect(form.awaiting).toBe(true)
        })

        it('sets awaiting to given value', () => {
            const form = new Form({})
            form.setAwaiting(true)
            expect(form.awaiting).toBe(true)
            form.setAwaiting(false)
            expect(form.awaiting).toBe(false)
        })

        it('returns this for chaining', () => {
            const form = new Form({})
            expect(form.setAwaiting()).toBe(form)
        })
    })

    describe('validate / validateField / validateForm', () => {
        it('validate() validates entire form when no field given', async () => {
            const form = new Form({
                name: validationField('John', ['required'], {required: 'Name is required'})
            })
            const result = await form.validate()
            expect(result).toBe(form)
        })

        it('validate() rejects when form validation fails', async () => {
            const form = new Form({
                name: validationField(null, ['required'], {required: 'Name is required'})
            })
            await expect(form.validate()).rejects.toBe(form)
            expect(form.errors.has('name')).toBe(true)
        })

        it('validateField resolves for valid field', async () => {
            const form = new Form({
                name: validationField('John', ['required'], {required: 'Required'})
            })
            await expect(form.validateField('name')).resolves.toBeUndefined()
        })

        it('validateField rejects and sets error message', async () => {
            const form = new Form({
                name: validationField(null, ['required'], {required: 'Name is required'})
            })
            await expect(form.validateField('name')).rejects.toBeUndefined()
            expect(form.errors.get('name')).toContain('Name is required')
        })

        it('validateField clears previous errors before validating', async () => {
            const form = new Form({
                name: validationField(null, ['required'], {required: 'Required'})
            })
            await form.validateField('name').catch(() => {})
            expect(form.errors.has('name')).toBe(true)

            form.name = 'valid'
            await form.validateField('name')
            expect(form.errors.has('name')).toBe(false)
        })

        it('validateField resolves for field without rules', async () => {
            const form = new Form({name: null})
            await expect(form.validateField('name')).resolves.toBeUndefined()
        })

        it('validateField resolves for field with empty rules', async () => {
            const form = new Form({})
            form.rules.push('name', [])
            form.originalValues['name'] = null
            await expect(form.validateField('name')).resolves.toBeUndefined()
        })

        it('validateField rejects with unknown rule', async () => {
            const form = new Form({
                name: validationField('test', ['nonexistent'], {})
            })
            await expect(form.validateField('name')).rejects.toThrow(
                'There is no validation rule called "nonexistent"'
            )
        })

        it('validate() delegates to validateField when field is given', async () => {
            const form = new Form({
                name: validationField('John', ['required'], {required: 'Required'})
            })
            await expect(form.validate('name')).resolves.toBeUndefined()
        })

        it('validateForm resolves with form on success', async () => {
            const form = new Form({
                a: validationField('1', ['required'], {required: 'R'}),
                b: validationField('2', ['required'], {required: 'R'})
            })
            await expect(form.validateForm()).resolves.toBe(form)
        })

        it('validateForm rejects with form on failure', async () => {
            const form = new Form({
                a: validationField(null, ['required'], {required: 'R'})
            })
            await expect(form.validateForm()).rejects.toBe(form)
        })

        it('supports rules with colon-separated parameters', async () => {
            const form = new Form({
                name: validationField('test', ['nonexistent:3'], {})
            })
            await expect(form.validateField('name')).rejects.toThrow()
        })

        it('validateField skips error push when message key is missing', async () => {
            const form = new Form({
                name: validationField(null, ['required'], {other_rule: 'Other message'})
            })
            await form.validateField('name').catch(() => {})
            expect(form.errors.has('name')).toBe(false)
        })
    })

    describe('wasChanged', () => {
        it('returns false for unchanged field', () => {
            const form = new Form({name: null})
            expect(form.wasChanged('name')).toBe(false)
        })

        it('returns true for changed field', () => {
            const form = new Form({name: null})
            form.name = 'John'
            expect(form.wasChanged('name')).toBe(true)
        })

        it('returns false after reset', () => {
            const form = new Form({name: null})
            form.name = 'John'
            form.reset()
            expect(form.wasChanged('name')).toBe(false)
        })

        it('returns true with array when any field changed', () => {
            const form = new Form({a: null, b: null})
            form.a = 'x'
            expect(form.wasChanged(['a', 'b'])).toBe(true)
        })

        it('returns false with array when no fields changed', () => {
            const form = new Form({a: null, b: null})
            expect(form.wasChanged(['a', 'b'])).toBe(false)
        })

        it('returns false for empty array', () => {
            const form = new Form({name: null})
            expect(form.wasChanged([])).toBe(false)
        })

        it('returns true when value changes from non-null', () => {
            const form = new Form({name: 'original'})
            form.name = 'changed'
            expect(form.wasChanged('name')).toBe(true)
        })

        it('returns false when value is set to same as original', () => {
            const form = new Form({name: 'same'})
            form.name = 'same'
            expect(form.wasChanged('name')).toBe(false)
        })
    })

    describe('filled', () => {
        it('returns false for null field', () => {
            const form = new Form({name: null})
            expect(form.filled('name')).toBe(false)
        })

        it('returns false for undefined field', () => {
            const form = new Form({})
            expect(form.filled('nonexistent')).toBe(false)
        })

        it('returns false for empty string', () => {
            const form = new Form({name: ''})
            expect(form.filled('name')).toBe(false)
        })

        it('returns true for non-empty string', () => {
            const form = new Form({name: null})
            form.name = 'keysdown'
            expect(form.filled('name')).toBe(true)
        })

        it('returns true for number 0', () => {
            const form = new Form({count: 0})
            expect(form.filled('count')).toBe(true)
        })

        it('returns true for boolean false', () => {
            const form = new Form({active: false})
            expect(form.filled('active')).toBe(true)
        })

        it('returns true with array when all fields are filled', () => {
            const form = new Form({a: 'x', b: 'y'})
            expect(form.filled(['a', 'b'])).toBe(true)
        })

        it('returns false with array when one field is not filled', () => {
            const form = new Form({a: null, b: 'y'})
            expect(form.filled(['a', 'b'])).toBe(false)
        })

        it('returns false with array when no fields are filled', () => {
            const form = new Form({a: null, b: null})
            expect(form.filled(['a', 'b'])).toBe(false)
        })

        it('returns true for empty array', () => {
            const form = new Form({})
            expect(form.filled([])).toBe(true)
        })
    })

    describe('values', () => {
        it('returns all field values', () => {
            const form = new Form({a: 1, b: 2})
            expect(form.values()).toEqual({a: 1, b: 2})
        })

        it('filters values with only parameter', () => {
            const form = new Form({a: 1, b: 2, c: 3})
            expect(form.values(['a', 'c'])).toEqual({a: 1, c: 3})
        })

        it('returns current (not original) values', () => {
            const form = new Form({a: 1})
            form.a = 99
            expect(form.values()).toEqual({a: 99})
        })
    })

    describe('valuesAsFormData', () => {
        it('returns FormData with all values', () => {
            const form = new Form({name: 'John'})
            const fd = form.valuesAsFormData()
            expect(fd).toBeInstanceOf(FormData)
            expect(fd.get('name')).toBe('John')
        })

        it('filters values with only parameter', () => {
            const form = new Form({a: '1', b: '2'})
            const fd = form.valuesAsFormData(['a'])
            expect(fd.get('a')).toBe('1')
            expect(fd.get('b')).toBeNull()
        })
    })

    describe('shortcut getters', () => {
        it('errors returns validation.errors', () => {
            const form = new Form({})
            expect(form.errors).toBe(form.validation.errors)
        })

        it('messages returns validation.messages', () => {
            const form = new Form({})
            expect(form.messages).toBe(form.validation.messages)
        })

        it('rules returns validation.rules', () => {
            const form = new Form({})
            expect(form.rules).toBe(form.validation.rules)
        })
    })
})
