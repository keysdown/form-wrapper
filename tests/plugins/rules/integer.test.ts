import {describe, it, expect} from 'vitest'
import integer from '../../../src/plugins/rules/integer'

describe('integer', () => {
    it('resolves with a positive integer', async () => {
        await expect(integer(1)).resolves.toBe(1)
    })

    it('resolves with a larger integer', async () => {
        await expect(integer(42)).resolves.toBe(42)
    })

    it('resolves with a negative integer', async () => {
        await expect(integer(-5)).resolves.toBe(-5)
    })

    it('resolves with zero', async () => {
        await expect(integer(0)).resolves.toBe(0)
    })

    it('resolves with a string integer', async () => {
        await expect(integer('10')).resolves.toBe('10')
    })

    it('resolves with a negative string integer', async () => {
        await expect(integer('-3')).resolves.toBe('-3')
    })

    it('rejects with a float', async () => {
        await expect(integer(3.14)).rejects.toBeUndefined()
    })

    it('rejects with a string float', async () => {
        await expect(integer('1.5')).rejects.toBeUndefined()
    })

    it('rejects with NaN', async () => {
        await expect(integer(NaN)).rejects.toBeUndefined()
    })

    it('rejects with Infinity', async () => {
        await expect(integer(Infinity)).rejects.toBeUndefined()
    })

    it('rejects with a non-numeric string', async () => {
        await expect(integer('abc')).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(integer(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(integer(undefined)).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(integer('')).rejects.toBeUndefined()
    })

    it('rejects boolean true', async () => {
        await expect(integer(true)).rejects.toBeUndefined()
    })

    it('rejects boolean false', async () => {
        await expect(integer(false)).rejects.toBeUndefined()
    })

    it('rejects arrays', async () => {
        await expect(integer([])).rejects.toBeUndefined()
        await expect(integer([1])).rejects.toBeUndefined()
    })
})
