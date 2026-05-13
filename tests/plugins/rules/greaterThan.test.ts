import {describe, it, expect} from 'vitest'
import greaterThan from '../../../src/plugins/rules/greaterThan'

describe('greaterThan rule', () => {
    it('resolves when value is greater than other field', async () => {
        await expect(greaterThan(15, ['other'], {other: 10})).resolves.toBe(15)
    })

    it('rejects when value is less than other field', async () => {
        await expect(greaterThan(5, ['other'], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when value equals other field', async () => {
        await expect(greaterThan(10, ['other'], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when no form is provided', async () => {
        await expect(greaterThan(15, ['other'])).rejects.toBeUndefined()
    })

    it('rejects when no attribute is provided', async () => {
        await expect(greaterThan(15, [], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when value is not a number', async () => {
        await expect(greaterThan('fifteen', ['other'], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when other field is not a number', async () => {
        await expect(greaterThan(15, ['other'], {other: 'ten'})).rejects.toBeUndefined()
    })
})
