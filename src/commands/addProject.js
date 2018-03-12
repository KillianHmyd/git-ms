/**
 * @flow
 */

import { getProjectsDefinition, insertProject } from '../lib/gitMs/index'
import type { ProjectType } from '../types/ProjectType'

/**
 * Create a ProjectType Object with the given name.
 * @param {string} projectName  The name of the project to create.
 */
const createProject = (projectName: string): ProjectType => ({
  name: projectName,
  microservices: [],
  tags: [],
})

/**
 * Add a project in the config.
 * @param {string} projectName The name of the project to add.
 */
const addProject = async (projectName: string): Promise<void> => {
  if (!projectName) {
    throw new Error('Missing project name.')
  }
  const { projects } = await getProjectsDefinition()
  if (projects.find((project: ProjectType): boolean => project.name === projectName)) {
    throw new Error(`Project ${projectName} already exists.`)
  }

  const newProject = createProject(projectName)
  await insertProject(newProject)
}

export default addProject
