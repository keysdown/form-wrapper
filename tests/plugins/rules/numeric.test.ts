import {describe, it, expect} from 'vitest'
import numeric from '../../../src/plugins/rules/numeric'

describe('numeric', () => {
    it('resolves with an integer number', async () => {
        await expect(numeric(42)).resolves.toBe(42)
    })

    it('resolves with a float number', async () => {
        await expect(numeric(3.14)).resolves.toBe(3.14)
    })

    it('resolves with zero', async () => {
        await expect(numeric(0)).resolves.toBe(0)
    })

    it('resolves with a negative number', async () => {
        await expect(numeric(-10)).resolves.toBe(-10)
    })

    it('resolves with a numeric string integer', async () => {
        await expect(numeric('100')).resolves.toBe('100')
    })

    it('resolves with a numeric string float', async () => {
        await expect(numeric('3.14')).resolves.toBe('3.14')
    })

    it('resolves with a negative numeric string', async () => {
        await expect(numeric('-5')).resolves.toBe('-5')
    })

    it('resolves with string zero', async () => {
        await expect(numeric('0')).resolves.toBe('0')
    })

    it('rejects with a non-numeric string', async () => {
        await expect(numeric('abc')).rejects.toBeUndefined()
    })

    it('rejects with a partially numeric string', async () => {
        await expect(numeric('123abc')).rejects.toBeUndefined()
    })

    it('rejects with an empty string', async () => {
        await expect(numeric('')).rejects.toBeUndefined()
    })

    it('rejects boolean true', async () => {
        await expect(numeric(true)).rejects.toBeUndefined()
    })

    it('rejects boolean false', async () => {
        await expect(numeric(false)).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(numeric(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(numeric(undefined)).rejects.toBeUndefined()
    })

    it('rejects arrays', async () => {
        await expect(numeric([])).rejects.toBeUndefined()
        await expect(numeric([1, 2])).rejects.toBeUndefined()
    })
})
