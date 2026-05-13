import {describe, it, expect} from 'vitest'
import lessThan from '../../../src/plugins/rules/lessThan'

describe('lessThan rule', () => {
    it('resolves when value is less than other field', async () => {
        await expect(lessThan(5, ['other'], {other: 10})).resolves.toBe(5)
    })

    it('rejects when value is greater than other field', async () => {
        await expect(lessThan(15, ['other'], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when value equals other field', async () => {
        await expect(lessThan(10, ['other'], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when no form is provided', async () => {
        await expect(lessThan(5, ['other'])).rejects.toBeUndefined()
    })

    it('rejects when no attribute is provided', async () => {
        await expect(lessThan(5, [], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when value is not a number', async () => {
        await expect(lessThan('five', ['other'], {other: 10})).rejects.toBeUndefined()
    })

    it('rejects when other field is not a number', async () => {
        await expect(lessThan(5, ['other'], {other: 'ten'})).rejects.toBeUndefined()
    })
})
