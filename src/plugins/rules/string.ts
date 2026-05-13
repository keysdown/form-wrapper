import {defineRule} from '../../utils/rule'

export default defineRule('string', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined) {
        return reject()
    }

    typeof value === 'string' ? resolve(value) : reject()
}))
