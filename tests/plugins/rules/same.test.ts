import {describe, it, expect} from 'vitest'
import same from '../../../src/plugins/rules/same'

describe('same rule', () => {
    it('resolves when value matches other field', async () => {
        await expect(same('hello', ['password'], {password: 'hello'})).resolves.toBe('hello')
    })

    it('rejects when value differs from other field', async () => {
        await expect(same('hello', ['password'], {password: 'world'})).rejects.toBeUndefined()
    })

    it('rejects when no form is provided', async () => {
        await expect(same('hello', ['password'])).rejects.toBeUndefined()
    })

    it('rejects when no attribute is provided', async () => {
        await expect(same('hello', [], {password: 'hello'})).rejects.toBeUndefined()
    })
})
