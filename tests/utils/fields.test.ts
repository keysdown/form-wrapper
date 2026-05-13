import {describe, it, expect} from 'vitest'
import {generateFieldDeclaration} from '../../src/utils/fields'
import required from '../../src/plugins/rules/required'
import email from '../../src/plugins/rules/email'

describe('generateFieldDeclaration', () => {
    it('generates declaration with array rules', () => {
        const decl = generateFieldDeclaration({
            value: 'test',
            validation: {
                rules: ['required', 'min:6'],
                messages: {required: 'Required field'}
            }
        })
        expect(decl.value).toBe('test')
        expect(decl.validation.rules).toEqual(['required', 'min:6'])
        expect(decl.validation.messages).toEqual({required: 'Required field'})
    })

    it('converts pipe-separated string rules to array', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {
                rules: 'required|min:6',
                messages: {}
            }
        })
        expect(decl.validation.rules).toEqual(['required', 'min:6'])
    })

    it('defaults rules to empty array when not provided', () => {
        const decl = generateFieldDeclaration({
            value: 'x',
            validation: {
                messages: {}
            }
        })
        expect(decl.validation.rules).toEqual([])
    })

    it('defaults messages to empty object when not provided', () => {
        const decl = generateFieldDeclaration({
            value: 'x',
            validation: {
                rules: ['required']
            }
        })
        expect(decl.validation.messages).toEqual({})
    })

    it('preserves falsy values with nullish coalescing', () => {
        const decl = generateFieldDeclaration({
            value: '',
            validation: {}
        })
        expect(decl.value).toBe('')

        const declZero = generateFieldDeclaration({
            value: 0,
            validation: {}
        })
        expect(declZero.value).toBe(0)

        const declFalse = generateFieldDeclaration({
            value: false,
            validation: {}
        })
        expect(declFalse.value).toBe(false)
    })

    it('defaults value to null when undefined', () => {
        const decl = generateFieldDeclaration({
            value: undefined,
            validation: {}
        })
        expect(decl.value).toBeNull()
    })

    it('defaults value to null when null', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {}
        })
        expect(decl.value).toBeNull()
    })

    it('defaults rules and messages when validation is missing', () => {
        const decl = generateFieldDeclaration({
            value: 'hello'
        })
        expect(decl.validation.rules).toEqual([])
        expect(decl.validation.messages).toEqual({})
        expect(decl.value).toBe('hello')
    })

    it('preserves rule functions in rules array', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {
                rules: [required, email, 'min:6'],
                messages: {required: 'Required'}
            }
        })
        expect(decl.validation.rules).toHaveLength(3)
        expect(decl.validation.rules[0]).toBe(required)
        expect(decl.validation.rules[1]).toBe(email)
        expect(decl.validation.rules[2]).toBe('min:6')
    })

    it('handles mixed function and string rules', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {
                rules: [required, 'email'],
                messages: {}
            }
        })
        expect(typeof decl.validation.rules[0]).toBe('function')
        expect(typeof decl.validation.rules[1]).toBe('string')
    })

    it('handles regex rule with pipe in pattern', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {
                rules: 'required|regex:/a|b/',
                messages: {}
            }
        })
        expect(decl.validation.rules).toEqual(['required', 'regex:/a|b/'])
    })

    it('handles regex rule with pipe as only rule', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {
                rules: 'regex:/a|b/',
                messages: {}
            }
        })
        expect(decl.validation.rules).toEqual(['regex:/a|b/'])
    })

    it('handles rules after regex in pipe-separated string', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {
                rules: 'regex:/^test$/|required|min:3',
                messages: {}
            }
        })
        expect(decl.validation.rules).toEqual(['regex:/^test$/', 'required', 'min:3'])
    })

    it('handles rules before and after regex in pipe-separated string', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {
                rules: 'email|regex:/a|b/|required',
                messages: {}
            }
        })
        expect(decl.validation.rules).toEqual(['email', 'regex:/a|b/', 'required'])
    })

    it('handles regex with flags in pipe-separated string', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {
                rules: 'required|regex:/pattern/gi|min:3',
                messages: {}
            }
        })
        expect(decl.validation.rules).toEqual(['required', 'regex:/pattern/gi', 'min:3'])
    })

    it('handles regex without slashes as fallback', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {
                rules: 'regex:simple',
                messages: {}
            }
        })
        expect(decl.validation.rules).toEqual(['regex:simple'])
    })

    it('handles regex with only opening slash', () => {
        const decl = generateFieldDeclaration({
            value: null,
            validation: {
                rules: 'regex:/pattern',
                messages: {}
            }
        })
        expect(decl.validation.rules).toEqual(['regex:/pattern'])
    })
})
