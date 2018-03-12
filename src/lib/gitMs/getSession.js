/**
 * @flow
 */
import path from 'path'
import fs from 'fs'

import type { SessionType } from '../../types'

import { PREFERENCES_PATH, SESSION_FILE_NAME } from '../../constants'
import { writeSessionFile } from '.'

/**
 * Retrieve and return the current session.
 * @returns  { GitProjectsDefinictionType }       The current session.
 */
const getSession = async (): Promise<SessionType> => {
  try {
    return JSON.parse(await fs.readFileSync(path.join(PREFERENCES_PATH, SESSION_FILE_NAME), 'utf8'))
  } catch (e) {
    if (e.message.includes('ENOENT: no such file or directory')) {
      await writeSessionFile({ currentProject: undefined })
      return JSON.parse(await fs.readFileSync(path.join(PREFERENCES_PATH, SESSION_FILE_NAME), 'utf8'))
    }

    throw e
  }
}

export default getSession
