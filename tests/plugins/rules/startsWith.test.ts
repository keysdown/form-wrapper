import {describe, it, expect} from 'vitest'
import startsWith from '../../../src/plugins/rules/startsWith'

describe('startsWith rule', () => {
    it('resolves when string starts with a matching prefix', async () => {
        await expect(startsWith('hello world', ['hello', 'hi'])).resolves.toBe('hello world')
    })

    it('resolves when string starts with the second attribute', async () => {
        await expect(startsWith('hi there', ['hello', 'hi'])).resolves.toBe('hi there')
    })

    it('rejects when string starts with none of the prefixes', async () => {
        await expect(startsWith('goodbye world', ['hello', 'hi'])).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(startsWith(null, ['hello'])).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(startsWith(undefined, ['hello'])).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(startsWith('', ['hello'])).rejects.toBeUndefined()
    })

    it('rejects with no attributes', async () => {
        await expect(startsWith('hello world', [])).rejects.toBeUndefined()
    })
})
