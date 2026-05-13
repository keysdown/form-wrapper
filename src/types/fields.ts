import { Validation } from './validations'

export interface Field {
    validation?: object,
    value: any,
    attribute?: string
}

export interface FieldDeclaration {
    validation: Validation,
    value: any
}

export interface Fields {
    [key: string]: Field
}

export interface RawFields {
    [key: string]: any
}