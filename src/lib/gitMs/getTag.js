/**
 * @flow
 */
import type { TagType } from '../../types'
import getTags from './getTags'

/**
 * Retrieve and return the tag in the given project.
 * @param   {string}            projectName         The name of the project in which to search the tag.
 * @param   {string}            tagName             The name of the tag to retrieve
 *
 * @returns {TagType}                      The found tag.
 */
const getTag = async (projectName: string, tagName: string): Promise<TagType> => {
  const tags = await getTags(projectName)

  const tag = tags.find((eltag: TagType): boolean => eltag.name === tagName)

  if (!tag) throw new Error(`No tag ${tagName} found in project ${projectName}`)

  return tag
}

export default getTag
