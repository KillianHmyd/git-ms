/**
 * @flow
 */
import type { TagType } from '../../types'
import getProject from './getProject'

/**
 * Return all the tags for the given project.
 * @param   {string}            projectName         The name of the project in which to search the tags.
 * @returns {TagType[]}                      The found tags.
 */
const getTags = async (projectName: string): Promise<TagType[]> => {
  const { tags } = await getProject(projectName)
  return tags
}

export default getTags
