import {describe, it, expect} from 'vitest'
import {defineRule} from '../../src/utils/rule'

describe('defineRule', () => {
    it('returns a function with ruleName property', () => {
        const handler = async (value: any) => value
        const rule = defineRule('custom', handler)

        expect(typeof rule).toBe('function')
        expect(rule.ruleName).toBe('custom')
    })

    it('returned function is the same as the handler', async () => {
        let called = false
        const handler = async (value: any) => {
            called = true
            return value
        }
        const rule = defineRule('test', handler)

        await rule('input')
        expect(called).toBe(true)
    })

    it('preserves handler return value', async () => {
        const handler = async (value: any) => `processed:${value}`
        const rule = defineRule('transform', handler)

        const result = await rule('input')
        expect(result).toBe('processed:input')
    })
})
