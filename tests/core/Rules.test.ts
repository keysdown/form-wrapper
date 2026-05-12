import {describe, it, expect} from 'vitest'
import {Rules} from '../../src/core/Rules'

describe('Rules', () => {
    it('push and get rules', () => {
        const rules = new Rules()
        rules.push('username', ['required', 'min:6'])
        expect(rules.get('username')).toEqual(['required', 'min:6'])
    })

    it('inherits Collection methods', () => {
        const rules = new Rules()
        rules.push('field', ['required'])
        expect(rules.has('field')).toBe(true)
        expect(rules.any()).toBe(true)
        rules.unset('field')
        expect(rules.has('field')).toBe(false)
        rules.fill({a: ['min:3']})
        expect(rules.all()).toEqual({a: ['min:3']})
    })
})
