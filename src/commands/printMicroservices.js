/**
 * @flow
 */

import { getProject, getMicroserviceInfo } from '../lib/gitMs'
import { group } from '../lib/log'

import type { MicroserviceType } from '../types'

/**
 * Return a string with all the microservices projects and teir status.
 * @param   {string}              projectName   The name of the project.
 * @returns {Promise<string>}                   A promise resolving the string to print.
 */
const printMicroservices = async (projectName: string): Promise<*> => {
  const { microservices } = await getProject(projectName)

  const pathsToPrint = []
  const namesToPrint = []
  const branchesToPrint = []
  const statusToPrint = []
  const untrackedToPrint = []
  let padEndPath = 25
  let padEndName = 10
  let padEndBranch = 20
  let padEndStatus = 10
  let padEndUntracked = 0

  const microservicesInfo = await Promise.all(
    microservices.map((microservice: MicroserviceType): Promise<Object> => getMicroserviceInfo(projectName, microservice.name)),
  )

  microservicesInfo.forEach((microserviceInfo: Object) => {
    const { path: pathString, name: nameString, branch: branchString, status: statusString, untracked: untrackedString } = microserviceInfo

    padEndPath = Math.max(padEndPath, pathString.length + 5)
    padEndName = Math.max(padEndName, nameString.length + 5)
    padEndBranch = Math.max(padEndBranch, branchString.length + 5)
    padEndStatus = Math.max(padEndStatus, statusString.length + 5)
    padEndUntracked = Math.max(padEndUntracked, untrackedString.length + 5)

    pathsToPrint.push(pathString)
    namesToPrint.push(nameString)
    branchesToPrint.push(branchString)
    statusToPrint.push(statusString)
    untrackedToPrint.push(untrackedString)
  })

  group.log(pathsToPrint
    .map(
      (el: string, index: number): string =>
        `${pathsToPrint[index].padEnd(padEndPath)} ${namesToPrint[index].padEnd(padEndName)} ${branchesToPrint[index].padEnd(
          padEndBranch,
        )} ${statusToPrint[index].padEnd(padEndStatus)} ${untrackedToPrint[index].padEnd(padEndUntracked)}`,
    )
    .join('\n'))
}

export default printMicroservices
