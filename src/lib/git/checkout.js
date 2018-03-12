/**
 * @flow
 */

import { execScript } from '../bash'

const SCRIPT_PATH = `${__dirname}/bashScripts/checkout.sh`

const checkout = async (path: string, branch: string): Promise<> => execScript(SCRIPT_PATH, path, branch)

export default checkout
