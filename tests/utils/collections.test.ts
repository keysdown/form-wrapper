import {describe, it, expect} from 'vitest'
import {Collection} from '../../src/utils/collections'

describe('Collection', () => {
    it('starts empty', () => {
        const c = new Collection<string>()
        expect(c.all()).toEqual({})
        expect(c.any()).toBe(false)
    })

    it('push sets a value and has/get retrieve it', () => {
        const c = new Collection<string>()
        c.push('name', 'value')
        expect(c.has('name')).toBe(true)
        expect(c.get('name')).toBe('value')
        expect(c.any()).toBe(true)
    })

    it('get returns null for missing key', () => {
        const c = new Collection<string>()
        expect(c.get('missing')).toBeNull()
        expect(c.get('missing', 'default')).toBe('default')
    })

    it('fill replaces all items', () => {
        const c = new Collection<string>()
        c.push('old', 'data')
        c.fill({a: '1', b: '2'})
        expect(c.all()).toEqual({a: '1', b: '2'})
        expect(c.has('old')).toBe(false)
    })

    it('unset removes a key', () => {
        const c = new Collection<string>()
        c.push('x', '1')
        c.unset('x')
        expect(c.has('x')).toBe(false)
    })

    it('unset on missing key does nothing', () => {
        const c = new Collection<string>()
        expect(c.unset('missing')).toBe(c)
    })

    it('clear empties the collection', () => {
        const c = new Collection<string>()
        c.push('a', '1').push('b', '2')
        c.clear()
        expect(c.any()).toBe(false)
        expect(c.all()).toEqual({})
    })

    it('first returns string of single value', () => {
        const c = new Collection<string>()
        c.push('key', 'hello')
        expect(c.first('key')).toBe('hello')
    })

    it('first returns first element of array', () => {
        const c = new Collection<string[]>()
        c.push('key', ['a', 'b', 'c'])
        expect(c.first('key')).toBe('a')
    })

    it('first returns null for missing key', () => {
        const c = new Collection<string>()
        expect(c.first('missing')).toBeNull()
    })

    it('first returns null for array with empty first element', () => {
        const c = new Collection<any>()
        c.push('key', [null])
        expect(c.first('key')).toBeNull()
    })

    it('has with array returns true if any key exists', () => {
        const c = new Collection<string>()
        c.push('name', 'value')
        expect(c.has(['name'])).toBe(true)
        expect(c.has(['name', 'missing'])).toBe(true)
    })

    it('has with array returns false if no keys exist', () => {
        const c = new Collection<string>()
        expect(c.has(['missing-a', 'missing-b'])).toBe(false)
    })

    it('has with empty array returns false', () => {
        const c = new Collection<string>()
        expect(c.has([])).toBe(false)
    })

    it('methods return this for chaining', () => {
        const c = new Collection<string>()
        const result = c.push('a', '1').fill({b: '2'}).unset('b').clear()
        expect(result).toBe(c)
    })
})
