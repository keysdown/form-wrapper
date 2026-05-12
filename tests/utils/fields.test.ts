import {describe, it, expect} from 'vitest'
import {generateFieldDeclaration} from '../../src/utils/fields'

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
})
