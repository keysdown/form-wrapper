import {FieldDeclaration} from '../types/fields'
import {RuleFunction, RuleString} from '../types/rules'

type RuleEntry = RuleString | RuleFunction

const generateValidationRules = (
    rules: string | RuleEntry[]
): RuleEntry[] => {
    if (typeof rules === 'string') {
        const result: RuleEntry[] = []
        let remaining = rules

        while (remaining.length > 0) {
            const regexIndex = remaining.indexOf('regex:')

            if (regexIndex !== -1) {
                const before = remaining.substring(0, regexIndex)

                if (before) {
                    result.push(...before.split('|').filter(Boolean))
                }

                const after = remaining.substring(regexIndex)
                const colonSlashIndex = after.indexOf(':/')

                if (colonSlashIndex !== -1) {
                    const patternStart = colonSlashIndex + 1
                    const lastSlashIndex = after.lastIndexOf('/')

                    if (lastSlashIndex > patternStart) {
                        const afterPattern = after.substring(lastSlashIndex + 1)
                        const matchResult = afterPattern.match(/^[gimsuy]*/)
                        const flags = matchResult![0]

                        const regexRule = after.substring(0, lastSlashIndex + 1 + flags.length)

                        result.push(regexRule)

                        remaining = afterPattern.substring(flags.length)

                        if (remaining.startsWith('|')) {
                            remaining = remaining.substring(1)
                        }

                        continue
                    }
                }

                result.push(after)

                break
            } else {
                result.push(...remaining.split('|').filter(Boolean))
                break
            }
        }

        return result
    }

    return rules
}

export const generateFieldDeclaration = (
    value: any
): FieldDeclaration => {
    return {
        validation: {
            rules: value.validation?.rules ?
                generateValidationRules(value.validation.rules) :
                [],
            messages: value.validation?.messages ?? {}
        },
        value: value.value ?? null
    }
}
