/**
 * @flow
 */
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

// $FlowFixMe: Flow can't detect export promisifi from util.
import { promisify } from 'util'

import { PREFERENCES_PATH, PROJECTS_DEFINITION_NAME } from '../../constants'

import type { GitProjectsDefinictionType } from '../../types/GitMsConfig'

const mkdirpSync = promisify(mkdirp)

/**
 * Write the project definition file
 * @param  { GitProjectsDefinictionType }   config    The config to write.
 */
const writeProjectsDefinition = async (config: GitProjectsDefinictionType): Promise<void> => {
  if (!fs.existsSync(PREFERENCES_PATH)) {
    await mkdirpSync(PREFERENCES_PATH)
  }

  await fs.writeFileSync(path.join(PREFERENCES_PATH, PROJECTS_DEFINITION_NAME), JSON.stringify(config, null, 2), 'utf8')
}

export default writeProjectsDefinition
