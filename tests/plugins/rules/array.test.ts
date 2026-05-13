import {describe, it, expect} from 'vitest'
import array from '../../../src/plugins/rules/array'

describe('array rule', () => {
    it('resolves with an array of values', async () => {
        await expect(array([1, 2, 3])).resolves.toEqual([1, 2, 3])
    })

    it('resolves with an empty array', async () => {
        await expect(array([])).resolves.toEqual([])
    })

    it('rejects with a string', async () => {
        await expect(array('hello')).rejects.toBeUndefined()
    })

    it('rejects with a number', async () => {
        await expect(array(123)).rejects.toBeUndefined()
    })

    it('rejects with an object', async () => {
        await expect(array({key: 'value'})).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(array(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(array(undefined)).rejects.toBeUndefined()
    })
})
