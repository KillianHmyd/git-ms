/**
 * @flow
 */

import { execScript } from '../bash'

const SCRIPT_PATH = `${__dirname}/bashScripts/getHomeDirectory.sh`

const getHomeDirectory = async (): Promise<string> => execScript(SCRIPT_PATH)

export default getHomeDirectory
