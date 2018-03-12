/**
 * @flow
 */
import { getProjectsDefinition, writeProjectsDefinition } from '.'

import type { ProjectType } from '../../types/ProjectType'

/**
 * Add a project to the GitMs Config.
 * @param {ProjectType}    project    The project to add to the config.
 */
const insertProject = async (project: ProjectType): Promise<void> => {
  const config = await getProjectsDefinition()
  config.projects.push(project)
  await writeProjectsDefinition(config)
}

export default insertProject
