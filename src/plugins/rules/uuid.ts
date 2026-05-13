import {defineRule} from '../../utils/rule'

export default defineRule('uuid', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    regex.test(String(value)) ? resolve(value) : reject()
}))
