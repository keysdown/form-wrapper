import {describe, it, expect} from 'vitest'
import max from '../../../src/plugins/rules/max'

describe('max', () => {
    describe('string', () => {
        it('resolves when string length <= max', async () => {
            await expect(max('hi', ['5'])).resolves.toBe('hi')
        })

        it('resolves when string length equals max', async () => {
            await expect(max('abc', ['3'])).resolves.toBe('abc')
        })

        it('rejects when string length exceeds max', async () => {
            await expect(max('hello', ['3'])).rejects.toBeUndefined()
        })
    })

    describe('number', () => {
        it('resolves when number <= max', async () => {
            await expect(max(3, ['5'])).resolves.toBe(3)
        })

        it('resolves when number equals max', async () => {
            await expect(max(5, ['5'])).resolves.toBe(5)
        })

        it('rejects when number exceeds max', async () => {
            await expect(max(10, ['5'])).rejects.toBeUndefined()
        })
    })

    describe('array', () => {
        it('resolves when array length <= max', async () => {
            await expect(max([1], ['2'])).resolves.toEqual([1])
        })

        it('resolves when array length equals max', async () => {
            await expect(max([1, 2], ['2'])).resolves.toEqual([1, 2])
        })

        it('rejects when array length exceeds max', async () => {
            await expect(max([1, 2, 3], ['2'])).rejects.toBeUndefined()
        })
    })

    describe('edge cases', () => {
        it('rejects with null', async () => {
            await expect(max(null, ['3'])).rejects.toBeUndefined()
        })

        it('rejects with undefined', async () => {
            await expect(max(undefined, ['3'])).rejects.toBeUndefined()
        })

        it('rejects with empty string', async () => {
            await expect(max('', ['1'])).rejects.toBeUndefined()
        })

        it('rejects with invalid attribute', async () => {
            await expect(max('hello', ['abc'])).rejects.toBeUndefined()
        })

        it('rejects with missing attribute', async () => {
            await expect(max('hello', [])).rejects.toBeUndefined()
        })
    })
})
