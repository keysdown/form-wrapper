import {defineRule} from '../../utils/rule'

export default defineRule('size', (value: any, attributes: string[]): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const sizeVal = Number(attributes[0])

    if (isNaN(sizeVal)) {
        return reject()
    }

    if (typeof value === 'number') {
        return value === sizeVal ? resolve(value) : reject()
    }

    if (Array.isArray(value)) {
        return value.length === sizeVal ? resolve(value) : reject()
    }

    const len = String(value).length
    len === sizeVal ? resolve(value) : reject()
}))
