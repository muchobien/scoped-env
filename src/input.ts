import {getInput} from '@actions/core'

export type Exporters = 'env' | 'output'

export class Input {
  get secrets(): Record<string, string> {
    try {
      return JSON.parse(getInput('secrets'))
    } catch (error) {
      throw new Error(`Failed to parse secrets`)
    }
  }

  get scope(): string {
    const input = getInput('scope')

    if (input === '') {
      throw new Error(`Missing scope`)
    }

    return input
  }

  get includes(): string[] {
    const input = getInput('includes')
    return input === '' ? [] : input.split(',')
  }

  get exporters(): Exporters[] {
    const input = getInput('exporters')
    return input === '' ? [] : (input.split(',') as Exporters[])
  }

  get overrides(): boolean {
    return getInput('overrides') === 'true'
  }
}
