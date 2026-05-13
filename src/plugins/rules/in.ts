import {defineRule} from '../../utils/rule'

export default defineRule('in', (value: any, attributes: string[]): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined) {
        return reject()
    }

    if (attributes.length === 0) {
        return reject()
    }

    attributes.includes(String(value)) ? resolve(value) : reject()
}))
