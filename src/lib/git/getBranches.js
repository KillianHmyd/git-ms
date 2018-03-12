/**
 * @flow
 */

import { execScript } from '../bash'

const SCRIPT_PATH = `${__dirname}/bashScripts/getBranches.sh`

const getCurrentBranch = async (path: string): Promise<string[]> => {
  const branchesAsString = await execScript(SCRIPT_PATH, path)

  let branches = branchesAsString.split('\n')
  branches = branches.map((branch: string): string => (branch.replace('*', '')).trim())

  return branches
}

export default getCurrentBranch
