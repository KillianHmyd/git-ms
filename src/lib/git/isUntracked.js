/**
 * @flow
 */

import { execScript } from '../bash'

const SCRIPT_PATH = `${__dirname}/bashScripts/isUntracked.sh`

const isUntracked = async (path: string): Promise<boolean> => {
  const responseIsUntracked = await execScript(SCRIPT_PATH, path)
  return responseIsUntracked === 'true'
}

export default isUntracked
