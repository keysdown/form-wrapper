import {describe, it, expect} from 'vitest'
import inRule from '../../../src/plugins/rules/in'

describe('in rule', () => {
    it('resolves when value is in the list', async () => {
        await expect(inRule('admin', ['admin', 'user', 'editor'])).resolves.toBe('admin')
    })

    it('rejects when value is not in the list', async () => {
        await expect(inRule('guest', ['admin', 'user'])).rejects.toBeUndefined()
    })

    it('rejects when value is null', async () => {
        await expect(inRule(null, ['admin', 'user'])).rejects.toBeUndefined()
    })

    it('rejects when value is undefined', async () => {
        await expect(inRule(undefined, ['admin', 'user'])).rejects.toBeUndefined()
    })

    it('rejects when attributes list is empty', async () => {
        await expect(inRule('admin', [])).rejects.toBeUndefined()
    })
})
