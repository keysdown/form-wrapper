import {defineRule} from '../../utils/rule'

export default defineRule('nullable', (value: any): Promise<any> => {
    return Promise.resolve(value)
})
