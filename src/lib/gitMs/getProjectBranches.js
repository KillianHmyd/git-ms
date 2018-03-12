/**
 * @flow
 */

import flatten from 'lodash.flatten'
import uniq from 'lodash.uniq'
import { getBranches } from '../git'
import { getProject } from '../gitMs'

import type { MicroserviceType } from '../../types'

/**
 * Retrieve and return the project's git branches.
 * @param   {string}        projectName     The name of the project.
 * @returns {string[]}                      The project's branches.
 */
const getProjectBranches = async (projectName: string): Promise<string[]> => {
  const project = await getProject(projectName)

  const getMicroservicesBranchesJob = project.microservices.map((microservice: MicroserviceType): Promise<> =>
    getBranches(microservice.path),
  )

  const projectBranches = await Promise.all(getMicroservicesBranchesJob)

  return uniq(flatten(projectBranches)).sort()
}

export default getProjectBranches
