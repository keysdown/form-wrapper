import {describe, it, expect} from 'vitest'
import size from '../../../src/plugins/rules/size'

describe('size', () => {
    describe('string', () => {
        it('resolves when string length equals size', async () => {
            await expect(size('hello', ['5'])).resolves.toBe('hello')
        })

        it('rejects when string length does not equal size', async () => {
            await expect(size('hi', ['5'])).rejects.toBeUndefined()
        })

        it('rejects when string is longer than size', async () => {
            await expect(size('hello world', ['5'])).rejects.toBeUndefined()
        })
    })

    describe('number', () => {
        it('resolves when number equals size', async () => {
            await expect(size(42, ['42'])).resolves.toBe(42)
        })

        it('rejects when number does not equal size', async () => {
            await expect(size(10, ['42'])).rejects.toBeUndefined()
        })

        it('resolves when number is zero and size is zero', async () => {
            await expect(size(0, ['0'])).resolves.toBe(0)
        })
    })

    describe('array', () => {
        it('resolves when array length equals size', async () => {
            await expect(size([1, 2, 3], ['3'])).resolves.toEqual([1, 2, 3])
        })

        it('rejects when array length does not equal size', async () => {
            await expect(size([1, 2], ['3'])).rejects.toBeUndefined()
        })

        it('resolves when array is empty and size is zero', async () => {
            await expect(size([], ['0'])).resolves.toEqual([])
        })
    })

    describe('edge cases', () => {
        it('rejects with null', async () => {
            await expect(size(null, ['3'])).rejects.toBeUndefined()
        })

        it('rejects with undefined', async () => {
            await expect(size(undefined, ['3'])).rejects.toBeUndefined()
        })

        it('rejects with empty string', async () => {
            await expect(size('', ['1'])).rejects.toBeUndefined()
        })

        it('rejects with invalid attribute', async () => {
            await expect(size('hello', ['abc'])).rejects.toBeUndefined()
        })

        it('rejects with missing attribute', async () => {
            await expect(size('hello', [])).rejects.toBeUndefined()
        })
    })
})
