export {default as required} from './required'
export {default as email} from './email'
export {default as url} from './url'
export {default as min} from './min'
export {default as max} from './max'
export {default as between} from './between'
export {default as size} from './size'
export {default as alpha} from './alpha'
export {default as alphaNumeric} from './alphaNumeric'
export {default as string} from './string'
export {default as integer} from './integer'
export {default as numeric} from './numeric'
export {default as array} from './array'
export {default as boolean} from './boolean'
export {default as date} from './date'
export {default as same} from './same'
export {default as different} from './different'
export {default as confirmed} from './confirmed'
export {default as inRule} from './in'
export {default as notIn} from './notIn'
export {default as regex} from './regex'
export {default as startsWith} from './startsWith'
export {default as endsWith} from './endsWith'
export {default as digits} from './digits'
export {default as digitsBetween} from './digitsBetween'
export {default as ip} from './ip'
export {default as json} from './json'
export {default as uuid} from './uuid'
export {default as lessThan} from './lessThan'
export {default as greaterThan} from './greaterThan'
export {default as lessThanOrEqual} from './lessThanOrEqual'
export {default as greaterThanOrEqual} from './greaterThanOrEqual'
export {default as nullable} from './nullable'

import {Rules} from '../../types/rules'
import required from './required'
import email from './email'
import url from './url'
import min from './min'
import max from './max'
import between from './between'
import size from './size'
import alpha from './alpha'
import alphaNumeric from './alphaNumeric'
import string from './string'
import integer from './integer'
import numeric from './numeric'
import array from './array'
import boolean from './boolean'
import date from './date'
import same from './same'
import different from './different'
import confirmed from './confirmed'
import inRule from './in'
import notIn from './notIn'
import regex from './regex'
import startsWith from './startsWith'
import endsWith from './endsWith'
import digits from './digits'
import digitsBetween from './digitsBetween'
import ip from './ip'
import json from './json'
import uuid from './uuid'
import lessThan from './lessThan'
import greaterThan from './greaterThan'
import lessThanOrEqual from './lessThanOrEqual'
import greaterThanOrEqual from './greaterThanOrEqual'
import nullable from './nullable'

export const allRules: Rules = {
    required,
    email,
    url,
    min,
    max,
    between,
    size,
    alpha,
    alphaNumeric,
    string,
    integer,
    numeric,
    array,
    boolean,
    date,
    same,
    different,
    confirmed,
    in: inRule,
    notIn,
    regex,
    startsWith,
    endsWith,
    digits,
    digitsBetween,
    ip,
    json,
    uuid,
    lessThan,
    greaterThan,
    lessThanOrEqual,
    greaterThanOrEqual,
    nullable,
}
