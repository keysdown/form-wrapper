import {describe, it, expect} from 'vitest'
import url from '../../../src/plugins/rules/url'

describe('url', () => {
    it('resolves with a valid https URL', async () => {
        await expect(url('https://example.com')).resolves.toBe('https://example.com')
    })

    it('resolves with a valid http URL', async () => {
        await expect(url('http://test.org/path')).resolves.toBe('http://test.org/path')
    })

    it('resolves with a URL with query parameters', async () => {
        await expect(url('https://example.com/search?q=test&page=1')).resolves.toBe(
            'https://example.com/search?q=test&page=1'
        )
    })

    it('resolves with a URL with a fragment', async () => {
        await expect(url('https://example.com/docs#section')).resolves.toBe(
            'https://example.com/docs#section'
        )
    })

    it('resolves with a localhost URL', async () => {
        await expect(url('http://localhost:3000')).resolves.toBe('http://localhost:3000')
    })

    it('rejects with a plain string', async () => {
        await expect(url('not-a-url')).rejects.toBeUndefined()
    })

    it('resolves with an ftp URL', async () => {
        await expect(url('ftp://example.com')).resolves.toBe('ftp://example.com')
    })

    it('rejects with a string missing protocol', async () => {
        await expect(url('example.com')).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(url(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(url(undefined)).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(url('')).rejects.toBeUndefined()
    })
})
