/**
 * @flow
 */

import { getProjectsDefinition, writeProjectsDefinition } from '../lib/gitMs/index'
import type { ProjectType } from '../types/ProjectType'

/**
 * Remove a project.
 * @param   {string}        projectName   The name of the project to delete.
 * @returns {Promise<void>}
 */
const removeProject = async (projectName?: string): Promise<void> => {
  if (!projectName) {
    throw new Error('Missing project name.')
  }
  const config = await getProjectsDefinition()
  const projectIndexToDelete = config.projects.findIndex((project: ProjectType): boolean => project.name === projectName)
  if (!projectIndexToDelete && projectIndexToDelete !== 0) {
    throw new Error(`Project ${projectName} doesn't exists.`)
  }

  config.projects.splice(projectIndexToDelete, 1)
  await writeProjectsDefinition(config)
}

export default removeProject
