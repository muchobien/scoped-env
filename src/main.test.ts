/* eslint-disable filenames/match-regex */
import * as core from '@actions/core'
import {run} from './main'

jest.mock('@actions/core')

const DEFAULT_INPUTS = {
  includes: '',
  exporters: 'env,output'
}

function mockGetInput(requestResponse: {[x: string]: unknown}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (name: string, options: unknown) {
    return requestResponse[name]
  }
}

describe('action', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = {...OLD_ENV}

    jest.clearAllMocks()

    // @ts-expect-error suppressing this error because we are mocking core.getInput
    core.getInput = jest.fn().mockImplementation(mockGetInput(DEFAULT_INPUTS))
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('should export scope secrets with prefix to env and output', async () => {
    const secrets = {
      PROD_SECRET_1: 'PROD_SECRET_1',
      PROD_SECRET_2: 'PROD_SECRET_2',
      PROD_SECRET_3: 'PROD_SECRET_3'
    }
    // @ts-expect-error suppressing this error because we are mocking core.getInput
    core.getInput = jest.fn().mockImplementation(
      mockGetInput({
        ...DEFAULT_INPUTS,
        secrets: JSON.stringify(secrets),
        scope: 'PROD'
      })
    )

    await run()

    //#region EXPECTED OUTPUTS
    expect(core.exportVariable).toHaveBeenCalledTimes(3)
    expect(core.setSecret).toHaveBeenCalledTimes(3)
    expect(core.setOutput).toHaveBeenCalledTimes(3)

    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_1',
      secrets.PROD_SECRET_1
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_2',
      secrets.PROD_SECRET_2
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_3',
      secrets.PROD_SECRET_3
    )
    expect(core.setSecret).toHaveBeenCalledWith(secrets.PROD_SECRET_1)
    expect(core.setSecret).toHaveBeenCalledWith(secrets.PROD_SECRET_2)
    expect(core.setSecret).toHaveBeenCalledWith(secrets.PROD_SECRET_3)
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_1',
      secrets.PROD_SECRET_1
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_2',
      secrets.PROD_SECRET_2
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_3',
      secrets.PROD_SECRET_3
    )
    //#endregion
  })

  test('should export scope secrets with suffix to env and output', async () => {
    const secrets = {
      SECRET_1_PROD: 'SECRET_1_PROD',
      SECRET_2_PROD: 'SECRET_2_PROD',
      SECRET_3_PROD: 'SECRET_3_PROD'
    }
    // @ts-expect-error suppressing this error because we are mocking core.getInput
    core.getInput = jest.fn().mockImplementation(
      mockGetInput({
        ...DEFAULT_INPUTS,
        secrets: JSON.stringify(secrets),
        scope: 'PROD'
      })
    )

    await run()

    //#region EXPECTED OUTPUTS
    expect(core.exportVariable).toHaveBeenCalledTimes(3)
    expect(core.setSecret).toHaveBeenCalledTimes(3)
    expect(core.setOutput).toHaveBeenCalledTimes(3)

    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_1',
      secrets.SECRET_1_PROD
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_2',
      secrets.SECRET_2_PROD
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_3',
      secrets.SECRET_3_PROD
    )
    expect(core.setSecret).toHaveBeenCalledWith(secrets.SECRET_1_PROD)
    expect(core.setSecret).toHaveBeenCalledWith(secrets.SECRET_2_PROD)
    expect(core.setSecret).toHaveBeenCalledWith(secrets.SECRET_3_PROD)
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_1',
      secrets.SECRET_1_PROD
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_2',
      secrets.SECRET_2_PROD
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_3',
      secrets.SECRET_3_PROD
    )
    //#endregion
  })

  test('should export scope secrets with prefix or suffix to env and output', async () => {
    const secrets = {
      PROD_SECRET_1: 'PROD_SECRET_1',
      PROD_SECRET_2: 'PROD_SECRET_2',
      SECRET_3_PROD: 'SECRET_3_PROD',
      SECRET_4_PROD: 'SECRET_4_PROD'
    }

    // @ts-expect-error suppressing this error because we are mocking core.getInput
    core.getInput = jest.fn().mockImplementation(
      mockGetInput({
        ...DEFAULT_INPUTS,
        secrets: JSON.stringify(secrets),
        scope: 'PROD'
      })
    )

    await run()

    //#region EXPECTED OUTPUTS
    expect(core.exportVariable).toHaveBeenCalledTimes(4)
    expect(core.setSecret).toHaveBeenCalledTimes(4)
    expect(core.setOutput).toHaveBeenCalledTimes(4)

    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_1',
      secrets.PROD_SECRET_1
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_2',
      secrets.PROD_SECRET_2
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_3',
      secrets.SECRET_3_PROD
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_4',
      secrets.SECRET_4_PROD
    )
    expect(core.setSecret).toHaveBeenCalledWith(secrets.PROD_SECRET_1)
    expect(core.setSecret).toHaveBeenCalledWith(secrets.PROD_SECRET_2)
    expect(core.setSecret).toHaveBeenCalledWith(secrets.SECRET_3_PROD)
    expect(core.setSecret).toHaveBeenCalledWith(secrets.SECRET_4_PROD)
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_1',
      secrets.PROD_SECRET_1
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_2',
      secrets.PROD_SECRET_2
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_3',
      secrets.SECRET_3_PROD
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_4',
      secrets.SECRET_4_PROD
    )
    //#endregion
  })

  test('should export scope secrets only to env', async () => {
    const secrets = {
      SECRET_1_PROD: 'SECRET_1_PROD',
      SECRET_2_PROD: 'SECRET_2_PROD',
      SECRET_3_PROD: 'SECRET_3_PROD'
    }
    // @ts-expect-error suppressing this error because we are mocking core.getInput
    core.getInput = jest.fn().mockImplementation(
      mockGetInput({
        ...DEFAULT_INPUTS,
        secrets: JSON.stringify(secrets),
        scope: 'PROD',
        exporters: 'env'
      })
    )

    await run()

    //#region EXPECTED OUTPUTS
    expect(core.exportVariable).toHaveBeenCalledTimes(3)
    expect(core.setSecret).toHaveBeenCalledTimes(3)
    expect(core.setOutput).toHaveBeenCalledTimes(0)

    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_1',
      secrets.SECRET_1_PROD
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_2',
      secrets.SECRET_2_PROD
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_3',
      secrets.SECRET_3_PROD
    )
    //#endregion
  })

  test('should export scope secrets only to output', async () => {
    const secrets = {
      SECRET_1_PROD: 'SECRET_1_PROD',
      SECRET_2_PROD: 'SECRET_2_PROD',
      SECRET_3_PROD: 'SECRET_3_PROD'
    }
    // @ts-expect-error suppressing this error because we are mocking core.getInput
    core.getInput = jest.fn().mockImplementation(
      mockGetInput({
        ...DEFAULT_INPUTS,
        secrets: JSON.stringify(secrets),
        scope: 'PROD',
        exporters: 'output'
      })
    )

    await run()

    //#region EXPECTED OUTPUTS
    expect(core.exportVariable).toHaveBeenCalledTimes(0)
    expect(core.setSecret).toHaveBeenCalledTimes(3)
    expect(core.setOutput).toHaveBeenCalledTimes(3)

    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_1',
      secrets.SECRET_1_PROD
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_2',
      secrets.SECRET_2_PROD
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'SECRET_3',
      secrets.SECRET_3_PROD
    )
    //#endregion
  })

  test('should export not scope secrets on includes', async () => {
    const secrets = {
      SECRET_1_PROD: 'SECRET_1_PROD',
      SECRET_2_PROD: 'SECRET_2_PROD',
      SHOULD_NOT_BE_EXPORTED: 'SHOULD_NOT_BE_EXPORTED',
      SHOULD_BE_EXPORTED: 'SHOULD_BE_EXPORTED',
      ALSO_SHOULD_BE_EXPORTED: 'ALSO_SHOULD_BE_EXPORTED'
    }

    // @ts-expect-error suppressing this error because we are mocking core.getInput
    core.getInput = jest.fn().mockImplementation(
      mockGetInput({
        ...DEFAULT_INPUTS,
        secrets: JSON.stringify(secrets),
        scope: 'PROD',
        exporters: 'env',
        includes: 'SHOULD_BE_EXPORTED,ALSO_SHOULD_BE_EXPORTED'
      })
    )

    await run()

    //#region EXPECTED OUTPUTS
    expect(core.exportVariable).toHaveBeenCalledTimes(4)
    expect(core.setSecret).toHaveBeenCalledTimes(4)
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_1',
      secrets.SECRET_1_PROD
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SECRET_2',
      secrets.SECRET_2_PROD
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SHOULD_BE_EXPORTED',
      secrets.SHOULD_BE_EXPORTED
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'ALSO_SHOULD_BE_EXPORTED',
      secrets.ALSO_SHOULD_BE_EXPORTED
    )
    expect(core.exportVariable).not.toHaveBeenCalledWith(
      'SHOULD_NOT_BE_EXPORTED',
      secrets.SHOULD_NOT_BE_EXPORTED
    )
    //#endregion
  })

  test('should fail if secrets is not a valid JSON', async () => {
    // @ts-expect-error suppressing this error because we are mocking core.getInput
    core.getInput = jest.fn().mockImplementation(
      mockGetInput({
        ...DEFAULT_INPUTS,
        secrets: 'not a valid JSON'
      })
    )

    await run()

    expect(core.setFailed).toHaveBeenCalledWith('Failed to parse secrets')
  })

  test('should fail on missing scope', async () => {
    // @ts-expect-error suppressing this error because we are mocking core.getInput
    core.getInput = jest.fn().mockImplementation(
      mockGetInput({
        ...DEFAULT_INPUTS,
        scope: ''
      })
    )

    await run()

    expect(core.setFailed).toHaveBeenCalledWith('Missing scope')
  })
})
