import {describe, it, expect} from 'vitest'
import confirmed from '../../../src/plugins/rules/confirmed'

describe('confirmed rule', () => {
    it('resolves when value matches confirmation field (via field parameter)', async () => {
        await expect(confirmed('hello', [], {password_confirmation: 'hello'}, 'password')).resolves.toBe('hello')
    })

    it('rejects when value does not match confirmation field (via field parameter)', async () => {
        await expect(confirmed('hello', [], {password_confirmation: 'world'}, 'password')).rejects.toBeUndefined()
    })

    it('resolves when value matches confirmation field (via attribute fallback)', async () => {
        await expect(confirmed('hello', ['password'], {password_confirmation: 'hello'})).resolves.toBe('hello')
    })

    it('rejects when value does not match confirmation field (via attribute fallback)', async () => {
        await expect(confirmed('hello', ['password'], {password_confirmation: 'world'})).rejects.toBeUndefined()
    })

    it('rejects when no form is provided', async () => {
        await expect(confirmed('hello', ['password'])).rejects.toBeUndefined()
    })

    it('rejects when no field or attribute is provided', async () => {
        await expect(confirmed('hello', [], {})).rejects.toBeUndefined()
    })

    it('rejects when confirmation field does not exist on form', async () => {
        await expect(confirmed('hello', [], {other_field: 'hello'}, 'password')).rejects.toBeUndefined()
    })

    it('uses attribute over field when both are provided', async () => {
        await expect(confirmed('hello', ['email'], {email_confirmation: 'hello'}, 'password')).resolves.toBe('hello')
    })

    it('rejects when attribute-based confirmation does not match even if field-based would', async () => {
        await expect(confirmed('hello', ['email'], {email_confirmation: 'world', password_confirmation: 'hello'}, 'password')).rejects.toBeUndefined()
    })
})
