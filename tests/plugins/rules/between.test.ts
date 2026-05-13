import {describe, it, expect} from 'vitest'
import between from '../../../src/plugins/rules/between'

describe('between', () => {
    describe('string', () => {
        it('resolves when string length is between min and max', async () => {
            await expect(between('hello', ['2', '6'])).resolves.toBe('hello')
        })

        it('resolves when string length equals min', async () => {
            await expect(between('ab', ['2', '5'])).resolves.toBe('ab')
        })

        it('resolves when string length equals max', async () => {
            await expect(between('abcde', ['2', '5'])).resolves.toBe('abcde')
        })

        it('rejects when string length is below min', async () => {
            await expect(between('a', ['2', '5'])).rejects.toBeUndefined()
        })

        it('rejects when string length exceeds max', async () => {
            await expect(between('abcdef', ['2', '5'])).rejects.toBeUndefined()
        })
    })

    describe('number', () => {
        it('resolves when number is between min and max', async () => {
            await expect(between(5, ['1', '10'])).resolves.toBe(5)
        })

        it('resolves when number equals min', async () => {
            await expect(between(1, ['1', '10'])).resolves.toBe(1)
        })

        it('resolves when number equals max', async () => {
            await expect(between(10, ['1', '10'])).resolves.toBe(10)
        })

        it('rejects when number is below min', async () => {
            await expect(between(0, ['1', '10'])).rejects.toBeUndefined()
        })

        it('rejects when number exceeds max', async () => {
            await expect(between(11, ['1', '10'])).rejects.toBeUndefined()
        })
    })

    describe('array', () => {
        it('resolves when array length is between min and max', async () => {
            await expect(between([1, 2, 3], ['2', '5'])).resolves.toEqual([1, 2, 3])
        })

        it('resolves when array length equals min', async () => {
            await expect(between([1, 2], ['2', '5'])).resolves.toEqual([1, 2])
        })

        it('resolves when array length equals max', async () => {
            await expect(between([1, 2, 3, 4, 5], ['2', '5'])).resolves.toEqual([1, 2, 3, 4, 5])
        })

        it('rejects when array length is below min', async () => {
            await expect(between([1], ['2', '5'])).rejects.toBeUndefined()
        })

        it('rejects when array length exceeds max', async () => {
            await expect(between([1, 2, 3, 4, 5, 6], ['2', '5'])).rejects.toBeUndefined()
        })
    })

    describe('edge cases', () => {
        it('rejects with null', async () => {
            await expect(between(null, ['1', '5'])).rejects.toBeUndefined()
        })

        it('rejects with undefined', async () => {
            await expect(between(undefined, ['1', '5'])).rejects.toBeUndefined()
        })

        it('rejects with empty string', async () => {
            await expect(between('', ['1', '5'])).rejects.toBeUndefined()
        })

        it('rejects with invalid min attribute', async () => {
            await expect(between('hello', ['abc', '5'])).rejects.toBeUndefined()
        })

        it('rejects with invalid max attribute', async () => {
            await expect(between('hello', ['1', 'abc'])).rejects.toBeUndefined()
        })

        it('rejects with missing attributes', async () => {
            await expect(between('hello', [])).rejects.toBeUndefined()
        })
    })
})
