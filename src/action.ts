import type {Input} from './input'
import type {Output} from './output'

export const action = async (input: Input, output: Output): Promise<void> => {
  const {scope, secrets, includes, exporters, overrides} = input

  const isPrefixOrSuffix = new RegExp(`(^${scope}_|_${scope}$)`)

  for (const [key, value] of Object.entries(secrets)) {
    if (key.startsWith(scope) || key.endsWith(scope)) {
      const newKey = key.replace(isPrefixOrSuffix, '')
      if (overrides || !process.env[newKey]) {
        output.export(key.replace(isPrefixOrSuffix, ''), value, exporters)
      }
    } else if (includes.includes(key)) {
      output.export(key, value, exporters)
    }
  }
}
