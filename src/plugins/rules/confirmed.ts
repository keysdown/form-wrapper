import {defineRule} from '../../utils/rule'

export default defineRule('confirmed', (value: any, attributes: string[], form?: any, field?: string): Promise<any> => new Promise((resolve, reject) => {
    if (!form) {
        return reject()
    }

    const baseField = attributes[0] || field

    if (!baseField) {
        return reject()
    }

    const confirmationField = `${baseField}_confirmation`

    if (form[confirmationField] !== undefined) {
        return value === form[confirmationField] ? resolve(value) : reject()
    }

    reject()
}))
