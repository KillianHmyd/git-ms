/**
 * @flow
 */

import getProject from './getProject'
import type { MicroserviceType } from '../../types/MicroserviceType'

/**
 * Retrieve and return a microservice. Thorw an error if no microservice is found.
 * @param   {string}            projectName         The name of the project to which belongs the searched microservice.
 * @param   {string}            microserviceName    The name of the searched microservice.
 * @returns {MicroserviceType}                      The found microservice.
 */
const getMicroservice = async (projectName: string, microserviceName: string): Promise<MicroserviceType> => {
  const project = await getProject(projectName)

  const microservice = project.microservices.find(
    (microserviceEl: MicroserviceType): boolean => microserviceEl.name === microserviceName,
  )

  if (!microservice) throw new Error(`No microservice ${microserviceName} found in project ${projectName}`)
  return microservice
}

export default getMicroservice
