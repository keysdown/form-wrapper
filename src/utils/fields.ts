import {FieldDeclaration} from '../types/fields'

const generateValidationRules = (
    rules: string | string[]
): string[] => {
    return typeof rules === 'string' ?
        rules.split('|') :
        rules
}

export const generateFieldDeclaration = (
    value: any
): FieldDeclaration => {
    return {
        validation: {
            rules: value.validation?.rules ?
                generateValidationRules(value.validation.rules) :
                [],
            messages: value.validation?.messages || {}
        },
        value: value.value || null
    }
}