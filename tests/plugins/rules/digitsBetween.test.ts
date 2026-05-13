import {describe, it, expect} from 'vitest'
import digitsBetween from '../../../src/plugins/rules/digitsBetween'

describe('digitsBetween rule', () => {
    it('resolves when digit count is within range', async () => {
        await expect(digitsBetween('12345', ['3', '6'])).resolves.toBe('12345')
    })

    it('resolves when digit count equals min', async () => {
        await expect(digitsBetween('123', ['3', '6'])).resolves.toBe('123')
    })

    it('resolves when digit count equals max', async () => {
        await expect(digitsBetween('123456', ['3', '6'])).resolves.toBe('123456')
    })

    it('rejects when digit count is below min', async () => {
        await expect(digitsBetween('12', ['3', '6'])).rejects.toBeUndefined()
    })

    it('rejects when digit count is above max', async () => {
        await expect(digitsBetween('1234567', ['3', '6'])).rejects.toBeUndefined()
    })

    it('rejects with non-digit characters', async () => {
        await expect(digitsBetween('12a45', ['3', '6'])).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(digitsBetween(null, ['3', '6'])).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(digitsBetween(undefined, ['3', '6'])).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(digitsBetween('', ['3', '6'])).rejects.toBeUndefined()
    })

    it('rejects with invalid min attribute', async () => {
        await expect(digitsBetween('12345', ['abc', '6'])).rejects.toBeUndefined()
    })

    it('rejects with invalid max attribute', async () => {
        await expect(digitsBetween('12345', ['3', 'xyz'])).rejects.toBeUndefined()
    })
})
