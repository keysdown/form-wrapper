import {RuleString, RuleFunction, ValidationRule} from './rules'

export interface Validation {
    rules: (RuleString | RuleFunction)[] | string,
    messages: Record<ValidationRule | string, string>
}
