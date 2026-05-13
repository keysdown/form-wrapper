import {describe, it, expect} from 'vitest'
import alphaNumeric from '../../../src/plugins/rules/alphaNumeric'

describe('alphaNumeric', () => {
    it('resolves with letters and numbers', async () => {
        await expect(alphaNumeric('hello123')).resolves.toBe('hello123')
    })

    it('resolves with uppercase letters and numbers', async () => {
        await expect(alphaNumeric('ABC456')).resolves.toBe('ABC456')
    })

    it('resolves with letters only', async () => {
        await expect(alphaNumeric('hello')).resolves.toBe('hello')
    })

    it('resolves with numbers only', async () => {
        await expect(alphaNumeric('12345')).resolves.toBe('12345')
    })

    it('rejects with special characters', async () => {
        await expect(alphaNumeric('hello!')).rejects.toBeUndefined()
    })

    it('rejects with the @ symbol', async () => {
        await expect(alphaNumeric('test@')).rejects.toBeUndefined()
    })

    it('rejects with spaces', async () => {
        await expect(alphaNumeric('hello 123')).rejects.toBeUndefined()
    })

    it('rejects with dots', async () => {
        await expect(alphaNumeric('hello.world')).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(alphaNumeric(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(alphaNumeric(undefined)).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(alphaNumeric('')).rejects.toBeUndefined()
    })
})
