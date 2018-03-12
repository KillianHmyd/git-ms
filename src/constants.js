/**
 * @flow
 */

export const PROJECTS_DEFINITION_NAME = '.projectsDefinition'
export const PREFERENCES_PATH = `${process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE || __dirname}/.git-ms/`
export const SESSION_FILE_NAME = '.session'


export default {
  PREFERENCES_PATH,
  PROJECTS_DEFINITION_NAME,
  SESSION_FILE_NAME,
}
