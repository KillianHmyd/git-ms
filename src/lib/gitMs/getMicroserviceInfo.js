/**
 * @flow
 */
import colors from 'colors/safe'

import { getMicroservice } from '.'
import { getHomeDirectory } from '../path'
import { getBranchStatus, getCurrentBranch } from '../git'
import isUntracked from '../git/isUntracked'

const getMicroserviceInfo = async (projectName: string, microserviceName: string): Promise<Object> => {
  const microservice = await getMicroservice(projectName, microserviceName)

  const branch = await getCurrentBranch(microservice.path)
  const status = await getBranchStatus(microservice.path)
  const isUntrackedBool = await isUntracked(microservice.path)

  let statusColors
  switch (status) {
    case 'Up-to-date':
      statusColors = 'green'
      break
    case 'Need to pull' || 'Need to push':
      statusColors = 'yellow'
      break
    default:
      statusColors = 'red'
      break
  }

  const homeDirectory = await getHomeDirectory()
  const pathString = `${colors.grey(microservice.path.replace(homeDirectory, '~'))}`
  const nameString = `${colors.yellow(microservice.name)}`
  const branchString = `${colors.yellow(branch)}`
  const statusString = `${colors[statusColors](status)}`
  const untrackedString = isUntrackedBool ? `${colors.red('[Untracked changes]')}` : ''

  return { path: pathString, name: nameString, branch: branchString, status: statusString, untracked: untrackedString }
}

export default getMicroserviceInfo
