import {describe, it, expect} from 'vitest'
import digits from '../../../src/plugins/rules/digits'

describe('digits rule', () => {
    it('resolves when value has exactly N digits', async () => {
        await expect(digits('1234', ['4'])).resolves.toBe('1234')
    })

    it('resolves when value is a number with exactly N digits', async () => {
        await expect(digits(1234, ['4'])).resolves.toBe(1234)
    })

    it('rejects when digit count does not match', async () => {
        await expect(digits('12345', ['4'])).rejects.toBeUndefined()
    })

    it('rejects when value has fewer digits', async () => {
        await expect(digits('12', ['4'])).rejects.toBeUndefined()
    })

    it('rejects with non-digit characters', async () => {
        await expect(digits('12a4', ['4'])).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(digits(null, ['4'])).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(digits(undefined, ['4'])).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(digits('', ['4'])).rejects.toBeUndefined()
    })

    it('rejects with invalid (non-numeric) attribute', async () => {
        await expect(digits('1234', ['abc'])).rejects.toBeUndefined()
    })
})
