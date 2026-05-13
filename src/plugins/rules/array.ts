import {defineRule} from '../../utils/rule'

export default defineRule('array', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined) {
        return reject()
    }

    Array.isArray(value) ? resolve(value) : reject()
}))
