import { Validation } from './validations'

export interface Field {
    validation?: object,
    value: any
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