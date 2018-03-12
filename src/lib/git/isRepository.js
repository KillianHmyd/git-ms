/**
 * @flow
 */

import { execScript } from '../bash'

const SCRIPT_PATH = `${__dirname}/bashScripts/isRepository.sh`

const isRepository = async (path: string): Promise<boolean> => {
  let isRepo = true
  await execScript(SCRIPT_PATH, path).catch(() => { isRepo = false })
  return isRepo
}

export default isRepository
