import {describe, it, expect} from 'vitest'
import uuid from '../../../src/plugins/rules/uuid'

describe('uuid rule', () => {
    it('resolves with a valid UUID', async () => {
        await expect(uuid('550e8400-e29b-41d4-a716-446655440000')).resolves.toBe('550e8400-e29b-41d4-a716-446655440000')
    })

    it('rejects with "not-a-uuid"', async () => {
        await expect(uuid('not-a-uuid')).rejects.toBeUndefined()
    })

    it('rejects with partial UUID', async () => {
        await expect(uuid('550e8400-e29b-41d4')).rejects.toBeUndefined()
    })

    it('rejects with "xyz"', async () => {
        await expect(uuid('xyz')).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(uuid(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(uuid(undefined)).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(uuid('')).rejects.toBeUndefined()
    })
})
