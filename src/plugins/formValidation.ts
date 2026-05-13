import {FormWrapperPlugin} from '../types/plugin'
import {allRules} from './rules'

const formValidation: FormWrapperPlugin = (_FormClass, ruleRegistry) => {
    Object.assign(ruleRegistry, allRules)
}

export default formValidation
