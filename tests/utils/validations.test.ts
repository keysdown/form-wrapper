import {describe, it, expect} from 'vitest'
import {required, Rule} from '../../src/utils/validations'

describe('required', () => {
    it('resolves with a valid string value', async () => {
        await expect(required('hello')).resolves.toBe('hello')
    })

    it('rejects when value is null', async () => {
        await expect(required(null)).rejects.toBeUndefined()
    })

    it('rejects when value is undefined', async () => {
        await expect(required(undefined)).rejects.toBeUndefined()
    })

    it('rejects when value is whitespace-only', async () => {
        await expect(required('   ')).rejects.toBeUndefined()
    })

    it('rejects when value is empty string', async () => {
        await expect(required('')).rejects.toBeUndefined()
    })

    it('resolves with numeric value as-is', async () => {
        await expect(required(123)).resolves.toBe(123)
    })
})

describe('Rule registry', () => {
    it('contains the required rule', () => {
        expect(Rule).toHaveProperty('required')
        expect(typeof Rule.required).toBe('function')
    })
})
