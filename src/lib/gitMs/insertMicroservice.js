/**
 * @flow
 */

import { getProject, updateProject } from '.'

import type { MicroserviceType } from '../../types'

/**
 * Add a project to the GitMs Config.
 * @param {ProjectType}    project    The project to add to the config.
 */
const insertMicroservice = async (projectName: string, microservice: MicroserviceType): Promise<void> => {
  const project = await getProject(projectName)
  project.microservices.push(microservice)
  await updateProject(project)
}

export default insertMicroservice
