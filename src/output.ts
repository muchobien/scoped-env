import {setFailed, setOutput, exportVariable, setSecret} from '@actions/core'
import {Exporters} from './input'

export class Output {
  failed(message: string | Error): void {
    setFailed(message)
  }

  set(key: string, value: unknown): void {
    setOutput(key, value)
  }

  export(key: string, value: string, exporters: Exporters[] = ['env']): void {
    setSecret(value)
    for (const exporter of exporters) {
      switch (exporter) {
        case 'env':
          exportVariable(key, value)
          break
        case 'output':
          this.set(key, value)
          break
        default:
          throw new Error(`Unknown exporter: ${exporter}`)
      }
    }
  }
}
