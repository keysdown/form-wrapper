import {describe, it, expect} from 'vitest'
import {Validation} from '../../src/core/Validation'
import {Errors} from '../../src/core/Errors'
import {Messages} from '../../src/core/Messages'
import {Rules} from '../../src/core/Rules'

describe('Validation', () => {
    it('has errors, messages, and rules instances', () => {
        const v = new Validation()
        expect(v.errors).toBeInstanceOf(Errors)
        expect(v.messages).toBeInstanceOf(Messages)
        expect(v.rules).toBeInstanceOf(Rules)
    })

    it('collections start empty', () => {
        const v = new Validation()
        expect(v.errors.any()).toBe(false)
        expect(v.messages.any()).toBe(false)
        expect(v.rules.any()).toBe(false)
    })
})
