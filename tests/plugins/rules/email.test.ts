import {describe, it, expect} from 'vitest'
import email from '../../../src/plugins/rules/email'

describe('email', () => {
    it('resolves with a standard email', async () => {
        await expect(email('user@example.com')).resolves.toBe('user@example.com')
    })

    it('resolves with a plus-tagged email', async () => {
        await expect(email('test+tag@domain.co')).resolves.toBe('test+tag@domain.co')
    })

    it('resolves with a dotted local part', async () => {
        await expect(email('first.last@domain.com')).resolves.toBe('first.last@domain.com')
    })

    it('resolves with a subdomain', async () => {
        await expect(email('user@mail.example.com')).resolves.toBe('user@mail.example.com')
    })

    it('resolves with a hyphenated domain', async () => {
        await expect(email('user@my-domain.org')).resolves.toBe('user@my-domain.org')
    })

    it('rejects with a string missing the @ sign', async () => {
        await expect(email('not-an-email')).rejects.toBeUndefined()
    })

    it('rejects with missing local part', async () => {
        await expect(email('@missing.com')).rejects.toBeUndefined()
    })

    it('rejects with missing domain', async () => {
        await expect(email('missing@')).rejects.toBeUndefined()
    })

    it('rejects with missing TLD', async () => {
        await expect(email('user@domain')).rejects.toBeUndefined()
    })

    it('rejects with spaces', async () => {
        await expect(email('user @domain.com')).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(email(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(email(undefined)).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(email('')).rejects.toBeUndefined()
    })
})
