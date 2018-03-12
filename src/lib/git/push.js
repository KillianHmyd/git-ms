/**
 * @flow
 */

import { execScript } from '../bash'

const SCRIPT_PATH = `${__dirname}/bashScripts/push.sh`

const pull = (path: string): Promise<> => execScript(SCRIPT_PATH, path)

export default pull
