/**
 * @flow
 */
import path from 'path'
import fs from 'fs'

import type { GitProjectsDefinictionType } from '../../types/GitMsConfig'

import { PREFERENCES_PATH, PROJECTS_DEFINITION_NAME } from '../../constants'
import { writeProjectsDefinition } from '.'

/**
 * Retrieve and return the GitMs ProjectDefiniction.
 * @returns  { GitProjectsDefinictionType }       The GitMs Config.
 */
const getProjectsDefinition = async (): Promise<GitProjectsDefinictionType> => {
  try {
    return JSON.parse(await fs.readFileSync(path.join(PREFERENCES_PATH, PROJECTS_DEFINITION_NAME), 'utf8'))
  } catch (e) {
    if (e.message.includes('ENOENT: no such file or directory')) {
      await writeProjectsDefinition({ projects: [] })
      return JSON.parse(await fs.readFileSync(path.join(PREFERENCES_PATH, PROJECTS_DEFINITION_NAME), 'utf8'))
    }

    throw e
  }
}

export default getProjectsDefinition
