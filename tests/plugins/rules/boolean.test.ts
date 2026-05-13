import {describe, it, expect} from 'vitest'
import boolean from '../../../src/plugins/rules/boolean'

describe('boolean rule', () => {
    it('resolves with true', async () => {
        await expect(boolean(true)).resolves.toBe(true)
    })

    it('resolves with false', async () => {
        await expect(boolean(false)).resolves.toBe(false)
    })

    it('resolves with 0', async () => {
        await expect(boolean(0)).resolves.toBe(0)
    })

    it('resolves with 1', async () => {
        await expect(boolean(1)).resolves.toBe(1)
    })

    it('resolves with "0"', async () => {
        await expect(boolean('0')).resolves.toBe('0')
    })

    it('resolves with "1"', async () => {
        await expect(boolean('1')).resolves.toBe('1')
    })

    it('rejects with "yes"', async () => {
        await expect(boolean('yes')).rejects.toBeUndefined()
    })

    it('rejects with 2', async () => {
        await expect(boolean(2)).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(boolean(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(boolean(undefined)).rejects.toBeUndefined()
    })
})
