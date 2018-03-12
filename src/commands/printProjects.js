/**
 * @flow
 */

import colors from 'colors/safe'
import { group } from '../lib/log/index'
import { getProjectsDefinition } from '../lib/gitMs/index'
import printMicroservices from './printMicroservices'

/**
 * Print all the saved projects.
 */
const printProjects = async (): Promise<void> => {
  const { projects } = await getProjectsDefinition()
  let errorOccured = false
  // eslint-disable-next-line no-restricted-syntax
  for (const project of projects) {
    console.log(`${colors.yellow(project.name)}:`)
    group.begin()
    try {
      // eslint-disable-next-line no-await-in-loop
      await printMicroservices(project.name)
    } catch (e) {
      errorOccured = true
      group.log(colors.red(e.message))
    }

    group.end()
  }
  if (errorOccured) throw new Error(' ')
}

export default printProjects
