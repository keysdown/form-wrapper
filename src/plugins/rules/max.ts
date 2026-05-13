import {defineRule} from '../../utils/rule'

export default defineRule('max', (value: any, attributes: string[]): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const maxVal = Number(attributes[0])

    if (isNaN(maxVal)) {
        return reject()
    }

    if (typeof value === 'number') {
        return value <= maxVal ? resolve(value) : reject()
    }

    if (Array.isArray(value)) {
        return value.length <= maxVal ? resolve(value) : reject()
    }

    const str = String(value)
    str.length <= maxVal ? resolve(value) : reject()
}))
