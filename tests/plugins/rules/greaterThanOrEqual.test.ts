import {describe, it, expect} from 'vitest'
import greaterThanOrEqual from '../../../src/plugins/rules/greaterThanOrEqual'

describe('greaterThanOrEqual rule', () => {
    it('resolves when value equals other field', async () => {
        await expect(greaterThanOrEqual(10, ['other'], {other: 10})).resolves.toBe(10)
    })

    it('resolves when value is greater than other field', async () => {
        await expect(greaterThanOrEqual(15, ['other'], {other: 10})).resolves.toBe(15)
    })

    it('rejects when value is less than other field', async () => {
        await expect(greaterThanOrEqual(5, ['other'], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when no form is provided', async () => {
        await expect(greaterThanOrEqual(10, ['other'])).rejects.toBeUndefined()
    })

    it('rejects when no attribute is provided', async () => {
        await expect(greaterThanOrEqual(10, [], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when value is not a number', async () => {
        await expect(greaterThanOrEqual('ten', ['other'], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when other field is not a number', async () => {
        await expect(greaterThanOrEqual(10, ['other'], {other: 'ten'})).rejects.toBeUndefined()
    })
})
