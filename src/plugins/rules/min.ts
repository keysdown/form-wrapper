import {defineRule} from '../../utils/rule'

export default defineRule('min', (value: any, attributes: string[]): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const minVal = Number(attributes[0])

    if (isNaN(minVal)) {
        return reject()
    }

    if (typeof value === 'number') {
        return value >= minVal ? resolve(value) : reject()
    }

    if (Array.isArray(value)) {
        return value.length >= minVal ? resolve(value) : reject()
    }

    const str = String(value)
    str.length >= minVal ? resolve(value) : reject()
}))
