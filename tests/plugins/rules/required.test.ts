import {describe, it, expect} from 'vitest'
import required from '../../../src/plugins/rules/required'

describe('required', () => {
    it('resolves with a valid string', async () => {
        await expect(required('hello')).resolves.toBe('hello')
    })

    it('resolves with a numeric value', async () => {
        await expect(required(42)).resolves.toBe(42)
    })

    it('resolves with the number zero', async () => {
        await expect(required(0)).resolves.toBe(0)
    })

    it('resolves with a boolean false', async () => {
        await expect(required(false)).resolves.toBe(false)
    })

    it('resolves with an array', async () => {
        await expect(required([1, 2, 3])).resolves.toEqual([1, 2, 3])
    })

    it('rejects with null', async () => {
        await expect(required(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(required(undefined)).rejects.toBeUndefined()
    })

    it('rejects with an empty string', async () => {
        await expect(required('')).rejects.toBeUndefined()
    })

    it('rejects with whitespace-only string', async () => {
        await expect(required('   ')).rejects.toBeUndefined()
    })

    it('rejects with tabs and newlines', async () => {
        await expect(required('\t\n ')).rejects.toBeUndefined()
    })
})
