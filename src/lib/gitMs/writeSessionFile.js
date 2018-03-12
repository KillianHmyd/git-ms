/**
 * @flow
 */
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

// $FlowFixMe: Flow can't detect export promisifi from util.
import { promisify } from 'util'

import { PREFERENCES_PATH, SESSION_FILE_NAME } from '../../constants'

import type { SessionType } from '../../types'

const mkdirpSync = promisify(mkdirp)

/**
 * Write the session file
 * @param  { SessionType }   config    The session to write.
 */
const writeSessionFile = async (session: SessionType): Promise<void> => {
  if (!fs.existsSync(PREFERENCES_PATH)) {
    await mkdirpSync(PREFERENCES_PATH)
  }

  await fs.writeFileSync(path.join(PREFERENCES_PATH, SESSION_FILE_NAME), JSON.stringify(session, null, 2), 'utf8')
}

export default writeSessionFile
