/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>
// Mock the writing of the summary
let writeMock: jest.SpiedFunction<typeof core.summary.write>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
    writeMock = jest.spyOn(core.summary, 'write').mockImplementation()
  })

  it('succeeds with valid SARIF input without any results', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        // Generate a passing SARIF object without any results
        case 'sarifFile':
          return 'empty.sarif'
        case 'owner':
          return 'owner'
        case 'repo':
          return 'repo'
        case 'branch':
          return 'branch'
        case 'sourceRoot':
          return 'sourceRoot'
        case 'details':
          return 'true'
        case 'suppressedResults':
          return 'true'
        case 'simple':
          return 'true'
        case 'severities':
          return 'error'
        case 'failOn':
          return 'error'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).not.toHaveBeenCalled()
    expect(errorMock).not.toHaveBeenCalled()
    expect(writeMock).toHaveBeenCalled()
  })

  it('fails with a valid SARIF input that has results', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        // Generate a failing SARIF object with results
        case 'sarifFile':
          return 'results.sarif'
        case 'owner':
          return 'owner'
        case 'repo':
          return 'repo'
        case 'branch':
          return 'branch'
        case 'sourceRoot':
          return 'sourceRoot'
        case 'details':
          return 'true'
        case 'suppressedResults':
          return 'true'
        case 'simple':
          return 'true'
        case 'severities':
          return 'error'
        case 'failOn':
          return 'error'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenCalled()
    expect(errorMock).not.toHaveBeenCalled()
    expect(writeMock).toHaveBeenCalled()
  })

  it('fails with invalid SARIF input', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'sarifFile':
          return 'invalid.sarif'
        case 'owner':
          return 'owner'
        case 'repo':
          return 'repo'
        case 'branch':
          return 'branch'
        case 'sourceRoot':
          return 'sourceRoot'
        case 'details':
          return 'true'
        case 'suppressedResults':
          return 'true'
        case 'simple':
          return 'true'
        case 'severities':
          return 'error'
        case 'failOn':
          return 'error'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenCalled()
    expect(errorMock).not.toHaveBeenCalled()
    expect(setOutputMock).not.toHaveBeenCalled()
    expect(writeMock).not.toHaveBeenCalled()
  })
})
