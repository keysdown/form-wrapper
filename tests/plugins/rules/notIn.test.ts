import {describe, it, expect} from 'vitest'
import notIn from '../../../src/plugins/rules/notIn'

describe('notIn rule', () => {
    it('resolves when value is not in the list', async () => {
        await expect(notIn('guest', ['admin', 'user'])).resolves.toBe('guest')
    })

    it('rejects when value is in the list', async () => {
        await expect(notIn('admin', ['admin', 'user'])).rejects.toBeUndefined()
    })

    it('rejects when value is null', async () => {
        await expect(notIn(null, ['admin', 'user'])).rejects.toBeUndefined()
    })

    it('rejects when value is undefined', async () => {
        await expect(notIn(undefined, ['admin', 'user'])).rejects.toBeUndefined()
    })

    it('resolves when attributes list is empty', async () => {
        await expect(notIn('admin', [])).resolves.toBe('admin')
    })
})
