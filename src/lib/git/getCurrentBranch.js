/**
 * @flow
 */

import { execScript } from '../bash'

const SCRIPT_PATH = `${__dirname}/bashScripts/getCurrentBranch.sh`

const getCurrentBranch = async (path: string): Promise<string> => execScript(SCRIPT_PATH, path)

export default getCurrentBranch
