/**
 * @flow
 */

import getProjectsDefinition from './getProjectsDefinition'
import type { ProjectType } from '../../types/ProjectType'

/**
 * Retrieve and return a project. Throw an error if no project is found.
 * @param   {string}        projectName     The name of the project.
 * @returns {ProjectType}                   The found project.
 */
const getProject = async (projectName: string): Promise<ProjectType> => {
  const config = await getProjectsDefinition()
  const project = config.projects.find((projectEl: ProjectType): boolean => projectEl.name === projectName)

  if (!project) throw new Error(`No project ${projectName} found`)

  return project
}

export default getProject
