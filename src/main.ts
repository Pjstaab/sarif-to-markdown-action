import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import { sarifToMarkdown } from '@security-alert/sarif-to-markdown'
import type { sarifFormatterOptions } from '@security-alert/sarif-to-markdown'

/**
 * Using @securit-alert/sarif-to-markdown to convert SARIF to markdown.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const sarifFile: string = core.getInput('sarifFile')
    const fullRepo: string = process.env['GITHUB_REPOSITORY'] || ''
    const owner: string = fullRepo.split('/')[0]
    const repo: string = fullRepo.split('/')[1]
    const branch: string = process.env['GITHUB_REF'] || 'Failed to get branch'
    const sourceRoot: string =
      process.env['GITHUB_WORKSPACE'] || 'Failed to get source root'
    const details: boolean = core.getInput('details') === 'true'
    const suppressedResults: boolean =
      core.getInput('suppressedResults') === 'true'
    const simple: boolean = core.getInput('simple') === 'true'
    const severities: string[] = core.getInput('severities').split(',')
    const failOn: string = core.getInput('failOn')

    // Convert the SARIF to markdown
    const opts: sarifFormatterOptions = {
      owner,
      repo,
      branch,
      sourceRoot,
      details,
      suppressedResults,
      simple,
      severities,
      failOn
    }

    // Define the path to the file
    const filePath = path.join(process.env['GITHUB_WORKSPACE'] || '', sarifFile)
    const data = fs.readFileSync(filePath, 'utf8')

    const result = sarifToMarkdown(opts)(JSON.parse(data))

    if (result[0].shouldFail) {
      core.setFailed(result[0].body)
    }

    // Output the markdown to the summary
    await core.summary
      .addHeading(result[0].title || 'Security Alert Report')
      .addRaw(result[0].body, true)
      .write()
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
