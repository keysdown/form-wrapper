import {Messages} from './Messages.ts'
import {Rules} from './Rules.ts'
import {Errors} from './Errors.ts'

export class Validation {
    public errors: Errors = new Errors()

    public messages: Messages = new Messages()

    public rules: Rules = new Rules()
}