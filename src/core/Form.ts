import {Field, FieldDeclaration, Fields, RawFields} from '../types/fields'
import {generateFieldDeclaration} from '../utils/fields'
import {Values} from '../types/values'
import {Validation} from './Validation'
import {Rules, RuleHandler} from '../types/rules'
import {FormWrapperPlugin} from '../types/plugin'
import {Locale, LocaleMessages} from '../types/locale'
import {objectToFormData} from '../utils/helpers'
import {ErrorMessage} from '../types/messages'

export class Form {
    [key: string]: any

    public static rules: Rules = {}

    public static defaultMessages: LocaleMessages = {}

    private static interpolateMessage(
        template: string,
        field: string,
        attributes: string[],
        fieldAttributes: Record<string, string>
    ): string {
        const fieldDisplay = fieldAttributes[field] || field.replace(/_/g, ' ')

        return template
            .replace(/:field/g, fieldDisplay)
            .replace(/:min/g, attributes[0] || '')
            .replace(/:max/g, attributes[1] || '')
            .replace(/:size/g, attributes[0] || '')
            .replace(/:digits/g, attributes[0] || '')
            .replace(/:other/g, attributes[0] ? (fieldAttributes[attributes[0]] || attributes[0].replace(/_/g, ' ')) : '')
            .replace(/:values/g, attributes.join(', '))
    }

    public awaiting: boolean = false

    public originalValues: Values = {}

    public fieldAttributes: Record<string, string> = {}

    public validation: Validation = new Validation()

    public constructor(
        fields: Fields | RawFields
    ) {
        this.addFields(fields)
    }

    public static extend(plugin: FormWrapperPlugin): typeof Form {
        plugin(Form, Form.rules)
        return Form
    }

    public static addRule(name: string, handler: RuleHandler): typeof Form {
        Form.rules[name] = Object.assign(handler, {ruleName: name})
        return Form
    }

    public static locale(locale: Locale): typeof Form {
        Form.defaultMessages = locale.messages
        return Form
    }

    public addField(
        field: string,
        value: Field
    ): this {
        if (value !== null && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]' && 'value' in value) {
            const fieldDeclaration: FieldDeclaration = generateFieldDeclaration(value)

            this[field] = fieldDeclaration.value

            this.originalValues[field] = fieldDeclaration.value

            this.validation.messages.push(field, fieldDeclaration.validation.messages)

            this.validation.rules.push(field, fieldDeclaration.validation.rules)

            if (value.attribute) {
                this.fieldAttributes[field] = value.attribute
            }
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
            const value = data[field]

            if (updateOriginalValues) {
                this.originalValues[field] = value
            }

            this[field] = value

            if (!(field in this.originalValues)) {
                this.originalValues[field] = value
            }
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

        delete this.fieldAttributes[field]

        this.validation.errors.unset(field)

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

    public wasChanged(
        field: string | string[]
    ): boolean {
        if (Array.isArray(field)) {
            return field.some(f => this[f] !== this.originalValues[f])
        }

        return this[field] !== this.originalValues[field]
    }

    public filled(
        field: string | string[]
    ): boolean {
        if (Array.isArray(field)) {
            return field.every(f => this[f] !== null && this[f] !== undefined && this[f] !== '')
        }

        return this[field] !== null && this[field] !== undefined && this[field] !== ''
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
            const staticRules = (this.constructor as typeof Form).rules

            const runRules = async (): Promise<void> => {
                for (const rawRule of rules) {
                    const rule: any = rawRule

                    if (typeof rule === 'function') {
                        if ('ruleName' in rule) {
                            const ruleName = rule.ruleName

                            if (ruleName === 'nullable' && (this[field] === null || this[field] === undefined || this[field] === '')) {
                                return
                            }

                            try {
                                await rule(this[field], [], this, field)
                            } catch (error) {
                                const errorMessage: ErrorMessage | null = this.validation.messages.get(field)

                                if (ruleName && errorMessage && ruleName in errorMessage) {
                                    this.validation.errors.push(field, errorMessage[ruleName])
                                } else if (ruleName in Form.defaultMessages) {
                                    this.validation.errors.push(field, Form.interpolateMessage(Form.defaultMessages[ruleName], field, [], this.fieldAttributes))
                                }

                                throw error
                            }
                        } else {
                            await new Promise<void>((resolve, reject) => {
                                let failed = false

                                const fail = (message?: string) => {
                                    failed = true
                                    if (message) {
                                        this.validation.errors.push(field, message)
                                    }
                                }

                                try {
                                    const result = rule({value: this[field], fail, form: this, field})

                                    if (result instanceof Promise) {
                                        result.then(() => {
                                            failed ? reject() : resolve()
                                        }).catch(() => {
                                            reject()
                                        })
                                    } else {
                                        failed ? reject() : resolve()
                                    }
                                } catch {
                                    reject()
                                }
                            })
                        }

                        continue
                    }

                    const colonIndex = rule.indexOf(':')

                    const ruleName: string = colonIndex === -1 ? rule : rule.substring(0, colonIndex)

                    if (ruleName === 'nullable' && (this[field] === null || this[field] === undefined || this[field] === '')) {
                        return
                    }

                    const ruleAttributes: string[] = colonIndex === -1 ? [] : rule.substring(colonIndex + 1).split(',')

                    if (ruleName in staticRules) {
                        try {
                            await staticRules[ruleName](this[field], ruleAttributes, this, field)
                        } catch (error) {
                            const errorMessage: ErrorMessage | null = this.validation.messages.get(field)

                            if (errorMessage && ruleName in errorMessage) {
                                this.validation.errors.push(field, errorMessage[ruleName])
                            } else if (ruleName in Form.defaultMessages) {
                                this.validation.errors.push(field, Form.interpolateMessage(Form.defaultMessages[ruleName], field, ruleAttributes, this.fieldAttributes))
                            }

                            throw error
                        }
                    } else {
                        throw new Error(`There is no validation rule called "${ruleName}"`)
                    }
                }
            }

            return runRules()
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

    public values(only?: string[]): Values {
        const values: Values = {}
        Object.keys(this.originalValues).forEach((field: string): void => {
            if (!only || only.includes(field)) {
                values[field] = this[field]
            }
        })

        return values
    }

    public filledValues(only?: string[]): Values {
        const values: Values = {}
        Object.keys(this.originalValues).forEach((field: string): void => {
            if ((!only || only.includes(field)) && this[field] != null) {
                values[field] = this[field]
            }
        })

        return values
    }

    public valuesAsFormData(only?: string[]) {
        return objectToFormData(this.values(only))
    }
}
