/**
 * @flow
 */

import getProject from './getProject'
import getSession from './getSession'
import type { ProjectType } from '../../types/ProjectType'

/**
 * Retrieve and return the current project. Throw an error if no project or session is found.
 * @returns {ProjectType}                   The current project.
 */
const getCurrentProject = async (): Promise<ProjectType> => {
  const session = await getSession()

  if (!session.currentProject) {
    throw new Error('Use git-ms use <project name> before.')
  }

  const currentProject = await getProject(session.currentProject.name)

  return currentProject
}

export default getCurrentProject
