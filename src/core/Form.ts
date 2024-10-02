import {Field, FieldDeclaration, Fields, RawFields} from '../types/fields'
import {generateFieldDeclaration} from '../utils/fields'
import {Values} from '../types/values'
import {Validation} from './Validation'
import {Rule} from '../utils/validations'
import {objectToFormData} from '../utils/helpers'
import {ErrorMessage} from '../types/messages'

export class Form {
    [key: string]: any

    public awaiting: boolean = false

    public originalValues: Values = {}

    public validation: Validation = new Validation()

    public constructor(
        fields: Fields | RawFields
    ) {
        this.addFields(fields)
    }

    public addField(
        field: string,
        value: Field
    ): this {
        if (typeof value === 'object' && 'value' in value) {
            const fieldDeclaration: FieldDeclaration = generateFieldDeclaration(value)

            this[field] = fieldDeclaration.value

            this.originalValues[field] = fieldDeclaration.value

            this.validation.messages.push(field, fieldDeclaration.validation.messages)

            this.validation.rules.push(field, fieldDeclaration.validation.rules)
        } else {
            this[field] = value

            this.originalValues[field] = value
        }

        return this
    }

    public addFields(
        fields: Fields | RawFields
    ): this {
        Object.keys(fields).forEach((field: string) => {
            this.addField(field, fields[field])
        })

        return this
    }

    public get errors() {
        return this.validation.errors
    }

    public fill(
        data: { [key: string]: any },
        updateOriginalValues: boolean = false
    ): this {
        Object.keys(data).forEach((field: string) => {
            let value = data[field]

            if (updateOriginalValues) {
                this.originalValues[field] = value
            }

            this[field] = value
        })

        return this
    }

    public get messages() {
        return this.validation.messages
    }

    public removeField(
        field: string
    ): this {
        delete this[field]

        delete this.originalValues[field]

        this.validation.messages.unset(field)

        this.validation.rules.unset(field)

        return this
    }

    public removeFields(
        fields: string[]
    ): this {
        fields.forEach((field: string) => {
            this.removeField(field)
        })

        return this
    }

    public reset(): this {
        this.validation.errors.clear()

        Object.keys(this.originalValues).forEach((field: string) => {
            this[field] = this.originalValues[field]
        })

        return this
    }

    public get rules() {
        return this.validation.rules
    }

    public setAwaiting(
        awaiting: boolean = true
    ): this {
        this.awaiting = awaiting

        return this
    }

    public validate(
        field: string | null = null
    ): Promise<this | void> {
        return field ? this.validateField(field) : this.validateForm()
    }

    public validateField(
        field: string
    ): Promise<void> {
        this.validation.errors.unset(field)

        const rules = this.validation.rules.get(field)

        if (rules && rules.length > 0) {
            const validations = rules.map((
                    rule: string
                ) => {
                    const ruleParts = rule.split(':')

                    const ruleName: string = ruleParts[0]
                    const ruleAttributes: string[] = ruleParts.length === 2 ? ruleParts[1].split(',') : []

                    if (ruleName in Rule) {
                        return Rule[ruleName](this[field], ruleAttributes)
                            .catch((error?: string) => {
                                const errorMessage: ErrorMessage | null = this.validation.messages.get(field)

                                if (errorMessage && ruleName in errorMessage) {
                                    this.validation.errors.push(field, errorMessage[ruleName])
                                }

                                return Promise.reject(error)
                            })
                    }

                    return Promise.reject(new Error(`There is no validation rule called "${rule}"`))
                }
            )

            return Promise.all(validations).then(() => {
            })
        }

        return Promise.resolve()
    }

    public validateForm(): Promise<this> {
        const validations = Object.keys(this.originalValues).map(
            (field: string) => this.validateField(field)
        )

        return Promise.all(validations)
            .then(() => Promise.resolve(this))
            .catch(() => Promise.reject(this))
    }

    public values(): Values {
        const values: Values = {}

        Object.keys(this.originalValues).forEach((field: string): void => {
            values[field] = this[field]
        })

        return values
    }

    public valuesAsFormData() {
        return objectToFormData(this.values())
    }
}