import {defineRule} from '../../utils/rule'

export default defineRule('integer', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '' || typeof value === 'boolean' || Array.isArray(value)) {
        return reject()
    }

    Number.isInteger(Number(value)) ? resolve(value) : reject()
}))
