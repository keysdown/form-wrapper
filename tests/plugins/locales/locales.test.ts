import {describe, it, expect} from 'vitest'
import en from '../../../src/plugins/locales/en'
import pt from '../../../src/plugins/locales/pt'
import es from '../../../src/plugins/locales/es'
import {Locale} from '../../../src/types/locale'

const expectedRules = [
    'required', 'email', 'url', 'min', 'max', 'between', 'size',
    'alpha', 'alphaNumeric', 'string', 'integer', 'numeric',
    'array', 'boolean', 'date', 'same', 'different', 'confirmed',
    'in', 'notIn', 'regex', 'startsWith', 'endsWith',
    'digits', 'digitsBetween', 'ip', 'json', 'uuid',
    'lessThan', 'greaterThan', 'lessThanOrEqual', 'greaterThanOrEqual',
    'nullable'
]

const checkLocale = (locale: Locale) => {
    it(`has name property`, () => {
        expect(typeof locale.name).toBe('string')
        expect(locale.name.length).toBeGreaterThan(0)
    })

    it(`has all 33 rule messages`, () => {
        expect(Object.keys(locale.messages).sort()).toEqual(expectedRules.sort())
    })

    it(`has non-empty string messages`, () => {
        for (const rule of expectedRules) {
            expect(typeof locale.messages[rule]).toBe('string')
            expect(locale.messages[rule].length).toBeGreaterThan(0)
        }
    })
}

describe('English locale', () => checkLocale(en))
describe('Portuguese locale', () => checkLocale(pt))
describe('Spanish locale', () => checkLocale(es))
