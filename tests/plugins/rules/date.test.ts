import {describe, it, expect} from 'vitest'
import date from '../../../src/plugins/rules/date'

describe('date rule', () => {
    it('resolves with a valid date string "2024-01-01"', async () => {
        await expect(date('2024-01-01')).resolves.toBe('2024-01-01')
    })

    it('resolves with a valid date string "Jan 1 2024"', async () => {
        await expect(date('Jan 1 2024')).resolves.toBe('Jan 1 2024')
    })

    it('rejects with "not-a-date"', async () => {
        await expect(date('not-a-date')).rejects.toBeUndefined()
    })

    it('rejects with "abc"', async () => {
        await expect(date('abc')).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(date(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(date(undefined)).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(date('')).rejects.toBeUndefined()
    })
})
