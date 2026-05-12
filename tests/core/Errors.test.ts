import {describe, it, expect} from 'vitest'
import {Errors} from '../../src/core/Errors'

describe('Errors', () => {
    it('push accumulates values into an array', () => {
        const errors = new Errors()
        errors.push('username', 'Required field')
        errors.push('username', 'Min 6 characters')
        expect(errors.get('username')).toEqual(['Required field', 'Min 6 characters'])
    })

    it('get returns empty array for missing key', () => {
        const errors = new Errors()
        expect(errors.get('missing')).toEqual([])
    })

    it('inherits Collection methods', () => {
        const errors = new Errors()
        errors.push('field', 'error')
        expect(errors.has('field')).toBe(true)
        expect(errors.any()).toBe(true)
        errors.unset('field')
        expect(errors.has('field')).toBe(false)
    })

    it('push falls back to empty array when stored value is null', () => {
        const errors = new Errors()
        errors.fill({field: null as any})
        errors.push('field', 'new error')
        expect(errors.get('field')).toEqual(['new error'])
    })
})
