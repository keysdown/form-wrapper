import {describe, it, expect} from 'vitest'
import endsWith from '../../../src/plugins/rules/endsWith'

describe('endsWith rule', () => {
    it('resolves when string ends with a matching suffix', async () => {
        await expect(endsWith('hello world', ['world', 'earth'])).resolves.toBe('hello world')
    })

    it('resolves when string ends with the second attribute', async () => {
        await expect(endsWith('hello earth', ['world', 'earth'])).resolves.toBe('hello earth')
    })

    it('rejects when string ends with none of the suffixes', async () => {
        await expect(endsWith('hello mars', ['world', 'earth'])).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(endsWith(null, ['world'])).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(endsWith(undefined, ['world'])).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(endsWith('', ['world'])).rejects.toBeUndefined()
    })

    it('rejects with no attributes', async () => {
        await expect(endsWith('hello world', [])).rejects.toBeUndefined()
    })
})
