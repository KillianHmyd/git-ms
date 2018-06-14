/**
 * @flow
 */

import { getTag, insertTag } from '../lib/gitMs/index'

/**
 * Add the given tag to the given project. The tag will be created with the current branches of every project's microservice.
 * 
 * @param {string} projectName  The name of the project in which to add a tag.
 * @param {string} tagName      The name of the tag to create.
 */
const addTag = async (projectName: string, tagName: string): Promise<void> => {
  if (!projectName || !tagName) {
    throw new Error(`Missing ${projectName ? 'tag' : 'project'} name.`)
  }

  const existingTag = await getTag(projectName, tagName).catch((err: Error) => {
    if (err.message !== `No tag ${tagName} found in project ${projectName}`) {
      throw err
    }
  })

  if (existingTag) throw new Error(`The tag ${tagName} already exists in project ${projectName}`)

  await insertTag(projectName, tagName)
}

export default addTag
