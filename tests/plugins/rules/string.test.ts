import {describe, it, expect} from 'vitest'
import string from '../../../src/plugins/rules/string'

describe('string', () => {
    it('resolves with a string value', async () => {
        await expect(string('hello')).resolves.toBe('hello')
    })

    it('resolves with an empty string', async () => {
        await expect(string('')).resolves.toBe('')
    })

    it('resolves with a whitespace string', async () => {
        await expect(string('   ')).resolves.toBe('   ')
    })

    it('resolves with a numeric string', async () => {
        await expect(string('123')).resolves.toBe('123')
    })

    it('rejects with a number', async () => {
        await expect(string(42)).rejects.toBeUndefined()
    })

    it('rejects with zero', async () => {
        await expect(string(0)).rejects.toBeUndefined()
    })

    it('rejects with a boolean true', async () => {
        await expect(string(true)).rejects.toBeUndefined()
    })

    it('rejects with a boolean false', async () => {
        await expect(string(false)).rejects.toBeUndefined()
    })

    it('rejects with an array', async () => {
        await expect(string([1, 2, 3])).rejects.toBeUndefined()
    })

    it('rejects with an object', async () => {
        await expect(string({key: 'value'})).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(string(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(string(undefined)).rejects.toBeUndefined()
    })
})
