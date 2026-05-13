import {RuleFunction} from '../types/rules'

export function defineRule(name: string, handler: (...args: any[]) => Promise<any>): RuleFunction {
    return Object.assign(handler, {ruleName: name})
}
