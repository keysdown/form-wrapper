import {defineRule} from '../../utils/rule'

export default defineRule('json', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    try {
        JSON.parse(String(value))
        resolve(value)
    } catch {
        reject()
    }
}))
