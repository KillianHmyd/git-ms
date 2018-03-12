/**
 * @flow
 */

import { getProject, insertMicroservice } from '../lib/gitMs/index'
import { isRepository } from '../lib/git/index'

import type { MicroserviceType } from '../types/index'

/**
 * Add the given microservice in the given project.
 * @param {string}            projectName   The name of the project in which to add a microservice.
 * @param {MicroserviceType}  microservice  The microservice to add.
 */
const addMicroservice = async (projectName: string, microservice: MicroserviceType): Promise<void> => {
  if (!projectName || !microservice) {
    throw new Error(`Missing ${projectName ? 'microservice' : 'project'} name.`)
  }
  const { microservices } = await getProject(projectName)
  if (microservices.find((microserviceEl: MicroserviceType): boolean => microserviceEl.name === microservice.name)) {
    throw new Error(`Microservice ${microservice.name} already exists.`)
  }

  const isRepo = await isRepository(microservice.path)

  if (!isRepo) {
    throw new Error(`${microservice.path} is not a valid git repository.`)
  }

  await insertMicroservice(projectName, microservice)
}

export default addMicroservice
