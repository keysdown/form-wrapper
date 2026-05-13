import {defineRule} from '../../utils/rule'

export default defineRule('numeric', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '' || typeof value === 'boolean' || Array.isArray(value)) {
        return reject()
    }

    !isNaN(Number(value)) ? resolve(value) : reject()
}))
