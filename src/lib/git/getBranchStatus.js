/**
 * @flow
 */
import colors from 'colors/safe'
import { execScript } from '../bash'

const SCRIPT_PATH = `${__dirname}/bashScripts/getBranchStatus.sh`

const handleNoUpstreamError = (error: Error): string => {
  if (error.message.includes('fatal: no upstream configured for branch')) {
    return `${colors.red('No upstream')}`
  }

  return `${colors.red('Unknown error')}`
}

const getCurrentBranch = async (path: string): Promise<string> => execScript(SCRIPT_PATH, path).catch((handleNoUpstreamError))

export default getCurrentBranch
