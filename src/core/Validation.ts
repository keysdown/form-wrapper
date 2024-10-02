import {Messages} from './Messages'
import {Rules} from './Rules'
import {Errors} from './Errors'

export class Validation {
    public errors: Errors = new Errors()

    public messages: Messages = new Messages()

    public rules: Rules = new Rules()
}