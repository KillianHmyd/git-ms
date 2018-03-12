/**
 * @flow
 */

import { getProject, updateProject } from '../lib/gitMs/index'

import type { MicroserviceType } from '../types/index'

/**
 * Remove a microservice in a given project.
 * @param   {string}              projectName     The name of the project which own the microservice.
 * @param   {MicroserviceType}    microservice    The microservice to delete.
 * @returns {Promise<void>}
 */
const removeMicroservice = async (projectName: string, microserviceName: string): Promise<void> => {
  if (!projectName || !microserviceName) {
    throw new Error(`Missing ${projectName ? 'microservice' : 'project'} name.`)
  }
  const project = await getProject(projectName)
  const microserviceIndexToDelete = project.microservices.findIndex(
    (microserviceEl: MicroserviceType): boolean => microserviceEl.name === microserviceName,
  )

  if (!microserviceIndexToDelete && microserviceIndexToDelete !== 0) {
    throw new Error(`Microservice ${microserviceName} doesn't exists.`)
  }

  project.microservices.splice(microserviceIndexToDelete, 1)

  await updateProject(project)
}

export default removeMicroservice
