export type ValidationRule =
    | 'required' | 'email' | 'url' | 'min' | 'max' | 'between' | 'size'
    | 'alpha' | 'alphaNumeric' | 'string' | 'integer' | 'numeric'
    | 'array' | 'boolean' | 'date' | 'same' | 'different' | 'confirmed'
    | 'in' | 'notIn' | 'regex' | 'startsWith' | 'endsWith'
    | 'digits' | 'digitsBetween' | 'ip' | 'json' | 'uuid'
    | 'lessThan' | 'greaterThan' | 'lessThanOrEqual' | 'greaterThanOrEqual'
    | 'nullable'
    | (string & {})

export type RuleString = ValidationRule | `${ValidationRule}:${string}`

export type RuleHandler = (value: any, attributes?: string[], form?: any, field?: string) => Promise<any>

export interface RuleFunction extends RuleHandler {
    ruleName: string
}

export interface Rules {
    [key: string]: RuleHandler
}
