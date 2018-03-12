/**
 * @flow
 */
import { getProjectsDefinition, writeProjectsDefinition } from '.'

import type { ProjectType } from '../../types/ProjectType'

/**
 * Add a project to the GitMs Config.
 * @param {ProjectType}    project    The project to add to the config.
 */
const updateProject = async (project: ProjectType): Promise<void> => {
  const config = await getProjectsDefinition()
  const index = config.projects.findIndex((elProject: ProjectType): boolean => elProject.name === project.name)
  config.projects.splice(index, 1, project)
  await writeProjectsDefinition(config)
}

export default updateProject
