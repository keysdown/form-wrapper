import {defineRule} from '../../utils/rule'

export default defineRule('between', (value: any, attributes: string[]): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const min = Number(attributes[0])
    const max = Number(attributes[1])

    if (isNaN(min) || isNaN(max)) {
        return reject()
    }

    if (typeof value === 'number') {
        return value >= min && value <= max ? resolve(value) : reject()
    }

    if (Array.isArray(value)) {
        return value.length >= min && value.length <= max ? resolve(value) : reject()
    }

    const len = String(value).length
    len >= min && len <= max ? resolve(value) : reject()
}))
