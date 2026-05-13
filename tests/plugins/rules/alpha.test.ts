import {describe, it, expect} from 'vitest'
import alpha from '../../../src/plugins/rules/alpha'

describe('alpha', () => {
    it('resolves with lowercase letters only', async () => {
        await expect(alpha('hello')).resolves.toBe('hello')
    })

    it('resolves with uppercase letters only', async () => {
        await expect(alpha('ABC')).resolves.toBe('ABC')
    })

    it('resolves with mixed case letters', async () => {
        await expect(alpha('HelloWorld')).resolves.toBe('HelloWorld')
    })

    it('resolves with a single letter', async () => {
        await expect(alpha('a')).resolves.toBe('a')
    })

    it('rejects with letters and numbers', async () => {
        await expect(alpha('hello123')).rejects.toBeUndefined()
    })

    it('rejects with letters and special characters', async () => {
        await expect(alpha('test!')).rejects.toBeUndefined()
    })

    it('rejects with spaces', async () => {
        await expect(alpha('hello world')).rejects.toBeUndefined()
    })

    it('rejects with numbers only', async () => {
        await expect(alpha('123')).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(alpha(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(alpha(undefined)).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(alpha('')).rejects.toBeUndefined()
    })
})
