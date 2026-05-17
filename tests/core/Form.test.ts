import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {Form} from '../../src/core/Form'
import required from '../../src/plugins/rules/required'
import email from '../../src/plugins/rules/email'
import en from '../../src/plugins/locales/en'
import pt from '../../src/plugins/locales/pt'

type InlineRuleParams = {value: any, fail: (msg?: string) => void, form: any, field: string}

const validationField = (value: any, rules: string[], messages: Record<string, string>) => ({
    value,
    validation: {rules, messages}
})

describe('Form', () => {
    beforeEach(() => {
        Form.rules = {}
        Form.rules['required'] = required
    })

    afterEach(() => {
        Form.rules = {}
    })

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

    describe('static rules registry', () => {
        it('starts with an empty rules registry by default', () => {
            Form.rules = {}
            expect(Object.keys(Form.rules)).toHaveLength(0)
        })

        it('holds registered rules', () => {
            Form.rules = {}
            Form.rules['required'] = required
            expect('required' in Form.rules).toBe(true)
            expect(typeof Form.rules['required']).toBe('function')
        })

        it('shares rules across instances', () => {
            Form.rules = {}
            Form.rules['required'] = required
            const form1 = new Form({a: null})
            const form2 = new Form({b: null})
            expect((form1.constructor as typeof Form).rules).toBe(Form.rules)
            expect((form2.constructor as typeof Form).rules).toBe(Form.rules)
        })
    })

    describe('extend', () => {
        it('calls plugin function with Form class and rules registry', () => {
            Form.rules = {}
            let receivedForm: any = null
            let receivedRules: any = null

            Form.extend((F, R) => {
                receivedForm = F
                receivedRules = R
            })

            expect(receivedForm).toBe(Form)
            expect(receivedRules).toBe(Form.rules)
        })

        it('registers rules from plugin', () => {
            Form.rules = {}
            const mockRule = async (value: any) => value

            Form.extend((_F, R) => {
                R['custom'] = mockRule
            })

            expect(Form.rules['custom']).toBe(mockRule)
        })

        it('returns Form class for chaining', () => {
            const result = Form.extend(() => {})
            expect(result).toBe(Form)
        })
    })

    describe('addRule', () => {
        it('registers a single rule', () => {
            Form.rules = {}
            const handler = async (value: any) => value

            Form.addRule('myRule', handler)

            expect(Form.rules['myRule']).toBe(handler)
        })

        it('returns Form class for chaining', () => {
            const result = Form.addRule('test', async (v) => v)
            expect(result).toBe(Form)
        })

        it('allows validation with custom rule', async () => {
            Form.rules = {}
            Form.addRule('alwaysPass', async (value) => value)

            const form = new Form({
                name: validationField('test', ['alwaysPass'], {})
            })

            await expect(form.validateField('name')).resolves.toBeUndefined()
        })

        it('allows validation with custom async rule', async () => {
            Form.rules = {}
            Form.addRule('asyncCheck', async (value) => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        value === 'valid' ? resolve(value) : reject()
                    }, 10)
                })
            })

            const form = new Form({
                name: validationField('valid', ['asyncCheck'], {asyncCheck: 'Invalid'})
            })

            await expect(form.validateField('name')).resolves.toBeUndefined()

            form.name = 'invalid'
            await expect(form.validateField('name')).rejects.toBeUndefined()
            expect(form.errors.get('name')).toContain('Invalid')
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

        it('adds new fields to originalValues', () => {
            const form = new Form({name: null})
            form.fill({name: 'John', email: 'test@test.com'})
            expect(form.values()).toEqual({name: 'John', email: 'test@test.com'})
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
            expect(form.errors.has('username')).toBe(false)
        })

        it('removes errors for the field', () => {
            const form = new Form({
                username: validationField(null, ['required'], {required: 'Required'})
            })
            form.errors.push('username', 'Some error')
            form.removeField('username')
            expect(form.errors.has('username')).toBe(false)
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

        it('preserves rules and messages after reset', () => {
            const form = new Form({
                name: validationField(null, ['required'], {required: 'Required'})
            })
            form.reset()
            expect(form.rules.has('name')).toBe(true)
            expect(form.messages.has('name')).toBe(true)
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

        it('validateForm sets errors for each failing field', async () => {
            const form = new Form({
                a: validationField(null, ['required'], {required: 'A required'}),
                b: validationField(null, ['required'], {required: 'B required'})
            })
            await form.validateForm().catch(() => {})
            expect(form.errors.get('a')).toContain('A required')
            expect(form.errors.get('b')).toContain('B required')
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

        it('passes form instance as third argument to rule', async () => {
            Form.rules = {}
            let receivedForm: any = null

            Form.addRule('checkForm', async (_value, _attrs, form) => {
                receivedForm = form
                return _value
            })

            const form = new Form({
                name: validationField('test', ['checkForm'], {})
            })

            await form.validateField('name')
            expect(receivedForm).toBe(form)
        })

        it('handles rules with regex containing colons', async () => {
            Form.rules = {}
            Form.addRule('regex', async (value, attrs = []) => {
                const pattern = attrs[0]
                const match = pattern.match(/^\/(.+)\/([gimsuy]*)$/)
                if (!match) return Promise.reject()
                const re = new RegExp(match[1], match[2])
                return re.test(String(value)) ? Promise.resolve(value) : Promise.reject()
            })

            const form = new Form({
                name: validationField('test:value', ['regex:/^test:.*$/'], {regex: 'No match'})
            })

            await expect(form.validateField('name')).resolves.toBeUndefined()
        })
    })

    describe('function-based rules', () => {
        it('validates using imported rule function', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: null,
                    validation: {rules: [required], messages: {required: 'Name is required'}}
                }
            })

            await expect(form.validateField('name')).rejects.toBeUndefined()
            expect(form.errors.get('name')).toContain('Name is required')
        })

        it('resolves when function rule passes', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: 'John',
                    validation: {rules: [required], messages: {required: 'Required'}}
                }
            })

            await expect(form.validateField('name')).resolves.toBeUndefined()
            expect(form.errors.has('name')).toBe(false)
        })

        it('validates with mixed function and string rules', async () => {
            Form.rules = {email}

            const form = new Form({
                address: {
                    value: null,
                    validation: {rules: [required, 'email'], messages: {required: 'Required', email: 'Invalid'}}
                }
            })

            await expect(form.validateField('address')).rejects.toBeUndefined()
            expect(form.errors.get('address')).toContain('Required')
        })

        it('does not push error when function rule has no matching message', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: null,
                    validation: {rules: [required], messages: {}}
                }
            })

            await form.validateField('name').catch(() => {})
            expect(form.errors.has('name')).toBe(false)
        })

        it('validates full form with function rules', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: 'John',
                    validation: {rules: [required], messages: {required: 'Required'}}
                }
            })

            await expect(form.validateForm()).resolves.toBe(form)
        })

        it('rejects full form with function rules on failure', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: null,
                    validation: {rules: [required], messages: {required: 'Required'}}
                }
            })

            await expect(form.validateForm()).rejects.toBe(form)
        })
    })

    describe('inline custom rules', () => {
        it('passes when inline rule does not call fail', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: 'John',
                    validation: {
                        rules: [({value, fail}: InlineRuleParams) => {
                            if (!value) fail('Name is required')
                        }],
                        messages: {}
                    }
                }
            })

            await expect(form.validateField('name')).resolves.toBeUndefined()
            expect(form.errors.has('name')).toBe(false)
        })

        it('fails when inline rule calls fail with message', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: null,
                    validation: {
                        rules: [({value, fail}: InlineRuleParams) => {
                            if (!value) fail('Name is required')
                        }],
                        messages: {}
                    }
                }
            })

            await expect(form.validateField('name')).rejects.toBeUndefined()
            expect(form.errors.get('name')).toContain('Name is required')
        })

        it('fails when inline rule calls fail without message', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: null,
                    validation: {
                        rules: [({fail}: InlineRuleParams) => {
                            fail()
                        }],
                        messages: {}
                    }
                }
            })

            await expect(form.validateField('name')).rejects.toBeUndefined()
            expect(form.errors.has('name')).toBe(false)
        })

        it('supports async inline rules', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: 'taken@email.com',
                    validation: {
                        rules: [async ({value, fail}: InlineRuleParams) => {
                            await new Promise(r => setTimeout(r, 10))
                            if (value === 'taken@email.com') fail('Email already taken')
                        }],
                        messages: {}
                    }
                }
            })

            await expect(form.validateField('name')).rejects.toBeUndefined()
            expect(form.errors.get('name')).toContain('Email already taken')
        })

        it('async inline rule passes when fail is not called', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: 'available@email.com',
                    validation: {
                        rules: [async ({value, fail}: InlineRuleParams) => {
                            await new Promise(r => setTimeout(r, 10))
                            if (value === 'taken@email.com') fail('Email already taken')
                        }],
                        messages: {}
                    }
                }
            })

            await expect(form.validateField('name')).resolves.toBeUndefined()
        })

        it('fails when inline rule throws', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: 'test',
                    validation: {
                        rules: [({}: InlineRuleParams) => {
                            throw new Error('unexpected')
                        }],
                        messages: {}
                    }
                }
            })

            await expect(form.validateField('name')).rejects.toBeUndefined()
        })

        it('fails when async inline rule rejects', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: 'test',
                    validation: {
                        rules: [async ({}: InlineRuleParams) => {
                            throw new Error('network error')
                        }],
                        messages: {}
                    }
                }
            })

            await expect(form.validateField('name')).rejects.toBeUndefined()
        })

        it('mixes inline rules with string rules', async () => {
            Form.rules = {required}

            const form = new Form({
                name: {
                    value: 'John',
                    validation: {
                        rules: ['required', ({value, fail}: InlineRuleParams) => {
                            if (value.length < 3) fail('Too short')
                        }],
                        messages: {required: 'Required'}
                    }
                }
            })

            await expect(form.validateField('name')).resolves.toBeUndefined()
        })

        it('mixes inline rules with imported function rules', async () => {
            Form.rules = {}

            const form = new Form({
                name: {
                    value: null,
                    validation: {
                        rules: [required, ({value, fail}: InlineRuleParams) => {
                            if (value && value.length < 3) fail('Too short')
                        }],
                        messages: {required: 'Required'}
                    }
                }
            })

            await expect(form.validateField('name')).rejects.toBeUndefined()
            expect(form.errors.get('name')).toContain('Required')
        })

        it('receives form instance via destructured parameter', async () => {
            Form.rules = {}

            const form = new Form({
                password: {
                    value: 'secret123',
                    validation: {rules: [], messages: {}}
                },
                password_confirmation: {
                    value: 'different',
                    validation: {
                        rules: [({value, fail, form}: InlineRuleParams) => {
                            if (value !== form.password) fail('Passwords do not match')
                        }],
                        messages: {}
                    }
                }
            })

            await expect(form.validateField('password_confirmation')).rejects.toBeUndefined()
            expect(form.errors.get('password_confirmation')).toContain('Passwords do not match')
        })

        it('inline rule with form access passes when values match', async () => {
            Form.rules = {}

            const form = new Form({
                password: {
                    value: 'secret123',
                    validation: {rules: [], messages: {}}
                },
                password_confirmation: {
                    value: 'secret123',
                    validation: {
                        rules: [({value, fail, form}: InlineRuleParams) => {
                            if (value !== form.password) fail('Passwords do not match')
                        }],
                        messages: {}
                    }
                }
            })

            await expect(form.validateField('password_confirmation')).resolves.toBeUndefined()
        })

        it('receives field name via destructured parameter', async () => {
            Form.rules = {}
            let receivedField: string | null = null

            const form = new Form({
                email: {
                    value: 'test@test.com',
                    validation: {
                        rules: [({field}: InlineRuleParams) => {
                            receivedField = field
                        }],
                        messages: {}
                    }
                }
            })

            await form.validateField('email')
            expect(receivedField).toBe('email')
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

    describe('filledValues', () => {
        it('returns only non-null and non-undefined values', () => {
            const form = new Form({a: 1, b: null, c: undefined, d: 'hello', e: 0, f: false, g: ''})
            expect(form.filledValues()).toEqual({a: 1, d: 'hello', e: 0, f: false, g: ''})
        })

        it('filters with only parameter', () => {
            const form = new Form({a: 1, b: null, c: 3})
            expect(form.filledValues(['a', 'b'])).toEqual({a: 1})
        })

        it('returns current (not original) values', () => {
            const form = new Form({a: 1, b: null})
            form.a = 99
            form.b = 'filled'
            expect(form.filledValues()).toEqual({a: 99, b: 'filled'})
        })

        it('returns empty object when all values are null or undefined', () => {
            const form = new Form({a: null, b: undefined})
            expect(form.filledValues()).toEqual({})
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

    describe('locale', () => {
        it('sets default messages via locale', () => {
            Form.locale(en)
            expect(Form.defaultMessages).toBe(en.messages)
        })

        it('returns Form class for chaining', () => {
            const result = Form.locale(en)
            expect(result).toBe(Form)
        })

        it('uses default message when no user message provided', async () => {
            Form.rules = {required}
            Form.locale(en)

            const form = new Form({
                name: {
                    value: null,
                    validation: {rules: ['required'], messages: {}}
                }
            })

            await form.validateField('name').catch(() => {})
            expect(form.errors.get('name')).toContain('The name field is required.')
        })

        it('user message overrides default message', async () => {
            Form.rules = {required}
            Form.locale(en)

            const form = new Form({
                name: {
                    value: null,
                    validation: {rules: ['required'], messages: {required: 'Custom message'}}
                }
            })

            await form.validateField('name').catch(() => {})
            expect(form.errors.get('name')).toContain('Custom message')
        })

        it('interpolates :field with underscores replaced by spaces', async () => {
            Form.rules = {required}
            Form.locale(en)

            const form = new Form({
                first_name: {
                    value: null,
                    validation: {rules: ['required'], messages: {}}
                }
            })

            await form.validateField('first_name').catch(() => {})
            expect(form.errors.get('first_name')).toContain('The first name field is required.')
        })

        it('interpolates :min and :max for string rules', async () => {
            Form.rules = {min: (await import('../../src/plugins/rules/min')).default}
            Form.locale(en)

            const form = new Form({
                password: {
                    value: 'ab',
                    validation: {rules: ['min:6'], messages: {}}
                }
            })

            await form.validateField('password').catch(() => {})
            expect(form.errors.get('password')).toContain('The password must be at least 6.')
        })

        it('uses Portuguese locale messages', async () => {
            Form.rules = {required}
            Form.locale(pt)

            const form = new Form({
                name: {
                    value: null,
                    validation: {rules: ['required'], messages: {}}
                }
            })

            await form.validateField('name').catch(() => {})
            expect(form.errors.get('name')).toContain('O campo name é obrigatório.')
        })

        it('uses default message for imported RuleFunction', async () => {
            Form.rules = {}
            Form.locale(en)

            const form = new Form({
                name: {
                    value: null,
                    validation: {rules: [required], messages: {}}
                }
            })

            await form.validateField('name').catch(() => {})
            expect(form.errors.get('name')).toContain('The name field is required.')
        })

        it('switches locale at runtime', async () => {
            Form.rules = {required}
            Form.locale(en)

            const formEn = new Form({
                name: {value: null, validation: {rules: ['required'], messages: {}}}
            })
            await formEn.validateField('name').catch(() => {})
            expect(formEn.errors.get('name')[0]).toContain('The')

            Form.locale(pt)

            const formPt = new Form({
                name: {value: null, validation: {rules: ['required'], messages: {}}}
            })
            await formPt.validateField('name').catch(() => {})
            expect(formPt.errors.get('name')[0]).toContain('O campo')
        })
    })

    describe('attribute', () => {
        it('uses attribute in default messages instead of field name', async () => {
            Form.rules = {required}
            Form.locale(en)

            const form = new Form({
                contact_email: {
                    value: null,
                    validation: {rules: ['required'], messages: {}},
                    attribute: 'contact email'
                }
            })

            await form.validateField('contact_email').catch(() => {})
            expect(form.errors.get('contact_email')).toContain('The contact email field is required.')
        })

        it('uses attribute in :other interpolation for cross-field rules', async () => {
            Form.rules = {greaterThan: (await import('../../src/plugins/rules/greaterThan')).default}
            Form.locale(en)

            const form = new Form({
                min_price: {
                    value: 100,
                    validation: {rules: [], messages: {}},
                    attribute: 'minimum price'
                },
                max_price: {
                    value: 50,
                    validation: {
                        rules: ['greaterThan:min_price'],
                        messages: {}
                    },
                    attribute: 'maximum price'
                }
            })

            await form.validateField('max_price').catch(() => {})
            expect(form.errors.get('max_price')).toContain('The maximum price must be greater than minimum price.')
        })

        it('falls back to field name with spaces when no attribute set', async () => {
            Form.rules = {required}
            Form.locale(en)

            const form = new Form({
                contact_email: {
                    value: null,
                    validation: {rules: ['required'], messages: {}}
                }
            })

            await form.validateField('contact_email').catch(() => {})
            expect(form.errors.get('contact_email')).toContain('The contact email field is required.')
        })

        it('removes attribute when field is removed', async () => {
            Form.rules = {}
            Form.locale(en)

            const form = new Form({
                name: {
                    value: null,
                    validation: {rules: [], messages: {}},
                    attribute: 'Full Name'
                }
            })

            form.removeField('name')
            expect((form as any).fieldAttributes['name']).toBeUndefined()
        })

        it('does not contaminate attributes between instances', async () => {
            Form.rules = {required}
            Form.locale(en)

            const form1 = new Form({
                email: {
                    value: null,
                    validation: {rules: ['required'], messages: {}},
                    attribute: 'Email Address'
                }
            })

            const form2 = new Form({
                email: {
                    value: null,
                    validation: {rules: ['required'], messages: {}},
                    attribute: 'Correo'
                }
            })

            await form1.validateField('email').catch(() => {})
            expect(form1.errors.get('email')).toEqual([expect.stringContaining('Email Address')])

            await form2.validateField('email').catch(() => {})
            expect(form2.errors.get('email')).toEqual([expect.stringContaining('Correo')])
        })
    })
})
