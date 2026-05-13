import {describe, it, expect} from 'vitest'
import json from '../../../src/plugins/rules/json'

describe('json rule', () => {
    it('resolves with valid JSON object string', async () => {
        await expect(json('{"key":"value"}')).resolves.toBe('{"key":"value"}')
    })

    it('resolves with valid JSON array string', async () => {
        await expect(json('[1,2,3]')).resolves.toBe('[1,2,3]')
    })

    it('resolves with valid JSON string value', async () => {
        await expect(json('"hello"')).resolves.toBe('"hello"')
    })

    it('resolves with valid JSON number', async () => {
        await expect(json('42')).resolves.toBe('42')
    })

    it('resolves with valid JSON boolean', async () => {
        await expect(json('true')).resolves.toBe('true')
    })

    it('resolves with valid JSON null', async () => {
        await expect(json('null')).resolves.toBe('null')
    })

    it('rejects with invalid JSON "{invalid}"', async () => {
        await expect(json('{invalid}')).rejects.toBeUndefined()
    })

    it('rejects with "not json"', async () => {
        await expect(json('not json')).rejects.toBeUndefined()
    })

    it('rejects with null', async () => {
        await expect(json(null)).rejects.toBeUndefined()
    })

    it('rejects with undefined', async () => {
        await expect(json(undefined)).rejects.toBeUndefined()
    })

    it('rejects with empty string', async () => {
        await expect(json('')).rejects.toBeUndefined()
    })
})
