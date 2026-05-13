import {describe, it, expect} from 'vitest'
import min from '../../../src/plugins/rules/min'

describe('min', () => {
    describe('string', () => {
        it('resolves when string length >= min', async () => {
            await expect(min('hello', ['3'])).resolves.toBe('hello')
        })

        it('resolves when string length equals min', async () => {
            await expect(min('abc', ['3'])).resolves.toBe('abc')
        })

        it('rejects when string length is less than min', async () => {
            await expect(min('hi', ['3'])).rejects.toBeUndefined()
        })
    })

    describe('number', () => {
        it('resolves when number >= min', async () => {
            await expect(min(10, ['5'])).resolves.toBe(10)
        })

        it('resolves when number equals min', async () => {
            await expect(min(5, ['5'])).resolves.toBe(5)
        })

        it('rejects when number is less than min', async () => {
            await expect(min(3, ['5'])).rejects.toBeUndefined()
        })
    })

    describe('array', () => {
        it('resolves when array length >= min', async () => {
            await expect(min([1, 2, 3], ['2'])).resolves.toEqual([1, 2, 3])
        })

        it('resolves when array length equals min', async () => {
            await expect(min([1, 2], ['2'])).resolves.toEqual([1, 2])
        })

        it('rejects when array length is less than min', async () => {
            await expect(min([1], ['2'])).rejects.toBeUndefined()
        })
    })

    describe('edge cases', () => {
        it('rejects with null', async () => {
            await expect(min(null, ['3'])).rejects.toBeUndefined()
        })

        it('rejects with undefined', async () => {
            await expect(min(undefined, ['3'])).rejects.toBeUndefined()
        })

        it('rejects with empty string', async () => {
            await expect(min('', ['1'])).rejects.toBeUndefined()
        })

        it('rejects with invalid attribute', async () => {
            await expect(min('hello', ['abc'])).rejects.toBeUndefined()
        })

        it('rejects with missing attribute', async () => {
            await expect(min('hello', [])).rejects.toBeUndefined()
        })
    })
})
