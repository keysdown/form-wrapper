import {describe, it, expect} from 'vitest'
import lessThanOrEqual from '../../../src/plugins/rules/lessThanOrEqual'

describe('lessThanOrEqual rule', () => {
    it('resolves when value equals other field', async () => {
        await expect(lessThanOrEqual(10, ['other'], {other: 10})).resolves.toBe(10)
    })

    it('resolves when value is less than other field', async () => {
        await expect(lessThanOrEqual(5, ['other'], {other: 10})).resolves.toBe(5)
    })

    it('rejects when value is greater than other field', async () => {
        await expect(lessThanOrEqual(15, ['other'], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when no form is provided', async () => {
        await expect(lessThanOrEqual(10, ['other'])).rejects.toBeUndefined()
    })

    it('rejects when no attribute is provided', async () => {
        await expect(lessThanOrEqual(10, [], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when value is not a number', async () => {
        await expect(lessThanOrEqual('ten', ['other'], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when other field is not a number', async () => {
        await expect(lessThanOrEqual(10, ['other'], {other: 'ten'})).rejects.toBeUndefined()
    })
})
