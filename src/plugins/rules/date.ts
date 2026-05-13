import {defineRule} from '../../utils/rule'

export default defineRule('date', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const parsed = new Date(String(value))

    !isNaN(parsed.getTime()) ? resolve(value) : reject()
}))
