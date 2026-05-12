import {describe, it, expect} from 'vitest'
import {Messages} from '../../src/core/Messages'

describe('Messages', () => {
    it('push and get messages', () => {
        const messages = new Messages()
        messages.push('username', {required: 'Username is required'})
        expect(messages.get('username')).toEqual({required: 'Username is required'})
    })

    it('inherits Collection methods', () => {
        const messages = new Messages()
        messages.push('field', {rule: 'msg'})
        expect(messages.has('field')).toBe(true)
        expect(messages.any()).toBe(true)
        messages.unset('field')
        expect(messages.has('field')).toBe(false)
        messages.fill({a: {x: 'y'}})
        expect(messages.all()).toEqual({a: {x: 'y'}})
    })
})
