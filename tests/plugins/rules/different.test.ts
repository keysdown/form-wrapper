import {describe, it, expect} from 'vitest'
import different from '../../../src/plugins/rules/different'

describe('different rule', () => {
    it('resolves when value differs from other field', async () => {
        await expect(different('hello', ['password'], {password: 'world'})).resolves.toBe('hello')
    })

    it('rejects when value is the same as other field', async () => {
        await expect(different('hello', ['password'], {password: 'hello'})).rejects.toBeUndefined()
    })

    it('rejects when no form is provided', async () => {
        await expect(different('hello', ['password'])).rejects.toBeUndefined()
    })

    it('rejects when no attribute is provided', async () => {
        await expect(different('hello', [], {password: 'world'})).rejects.toBeUndefined()
    })
})
