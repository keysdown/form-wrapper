import {describe, it, expect} from 'vitest'
import {isObject, objectToFormData} from '../../src/utils/helpers'

describe('isObject', () => {
    it('returns true for plain objects', () => {
        expect(isObject({})).toBe(true)
        expect(isObject({a: 1})).toBe(true)
    })

    it('returns false for null', () => {
        expect(isObject(null)).toBe(false)
    })

    it('returns false for arrays', () => {
        expect(isObject([])).toBe(false)
        expect(isObject([1, 2])).toBe(false)
    })

    it('returns false for primitives', () => {
        expect(isObject('string')).toBe(false)
        expect(isObject(123)).toBe(false)
        expect(isObject(true)).toBe(false)
        expect(isObject(undefined)).toBe(false)
    })

    it('returns true for File instances', () => {
        const file = new File([''], 'test.txt')
        expect(isObject(file)).toBe(true)
    })
})

describe('objectToFormData', () => {
    it('converts flat object to FormData', () => {
        const fd = objectToFormData({name: 'John', age: '30'})
        expect(fd.get('name')).toBe('John')
        expect(fd.get('age')).toBe('30')
    })

    it('skips null and undefined values', () => {
        const fd = objectToFormData({a: 'keep', b: null, c: undefined})
        expect(fd.get('a')).toBe('keep')
        expect(fd.get('b')).toBeNull()
        expect(fd.get('c')).toBeNull()
    })

    it('converts nested objects with bracket notation', () => {
        const fd = objectToFormData({user: {name: 'John', email: 'john@test.com'}})
        expect(fd.get('user[name]')).toBe('John')
        expect(fd.get('user[email]')).toBe('john@test.com')
    })

    it('converts arrays with bracket notation', () => {
        const fd = objectToFormData({tags: ['a', 'b']})
        expect(fd.get('tags[0]')).toBe('a')
        expect(fd.get('tags[1]')).toBe('b')
    })

    it('appends to existing FormData context', () => {
        const existing = new FormData()
        existing.append('existing', 'value')
        const fd = objectToFormData({newField: 'new'}, existing)
        expect(fd.get('existing')).toBe('value')
        expect(fd.get('newField')).toBe('new')
    })

    it('handles File instances as direct values', () => {
        const file = new File(['content'], 'test.txt', {type: 'text/plain'})
        const fd = objectToFormData({file})
        expect(fd.get('file')).toBe(file)
    })

    it('handles deeply nested objects', () => {
        const fd = objectToFormData({a: {b: {c: 'deep'}}})
        expect(fd.get('a[b][c]')).toBe('deep')
    })
})
