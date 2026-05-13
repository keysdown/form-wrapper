import {describe, it, expect} from 'vitest'
import regex from '../../../src/plugins/rules/regex'

describe('regex rule', () => {
    it('resolves when pattern matches', async () => {
        await expect(regex('hello123', ['/^hello/'])).resolves.toBe('hello123')
    })

    it('rejects when pattern does not match', async () => {
        await expect(regex('world', ['/^hello/'])).rejects.toBeUndefined()
    })

    it('resolves when pattern matches with flags', async () => {
        await expect(regex('Hello', ['/^hello/i'])).resolves.toBe('Hello')
    })

    it('rejects when value is null', async () => {
        await expect(regex(null, ['/^hello/'])).rejects.toBeUndefined()
    })

    it('rejects when value is undefined', async () => {
        await expect(regex(undefined, ['/^hello/'])).rejects.toBeUndefined()
    })

    it('rejects when value is empty string', async () => {
        await expect(regex('', ['/^hello/'])).rejects.toBeUndefined()
    })

    it('rejects when no attributes are provided', async () => {
        await expect(regex('hello', [])).rejects.toBeUndefined()
    })

    it('rejects with invalid pattern format (no delimiters)', async () => {
        await expect(regex('hello', ['hello'])).rejects.toBeUndefined()
    })
})
