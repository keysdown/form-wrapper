import {Rules} from './rules'

export type FormWrapperPlugin = (
    FormClass: any,
    RuleRegistry: Rules
) => void
