/**
 * @flow
 */

import { getProject, updateProject } from '../lib/gitMs/index'

import type { TagType } from '../types/index'

/**
 * Remove a tag in a given project.
 * @param   {string}              projectName     The name of the project which own the microservice.
 * @param   {TagType}    microservice    The microservice to delete.
 * @returns {Promise<void>}
 */
const removeTag = async (projectName: string, tagName: string): Promise<void> => {
  if (!projectName || !tagName) {
    throw new Error(`Missing ${projectName ? 'tag' : 'project'} name.`)
  }
  const project = await getProject(projectName)
  const tagIndexToDelete = project.tags.findIndex(
    (tagEl: TagType): boolean => tagEl.name === tagName,
  )

  if (tagIndexToDelete < 0) {
    throw new Error(`Microservice ${tagIndexToDelete} doesn't exists.`)
  }

  project.microservices.splice(tagIndexToDelete, 1)

  await updateProject(project)
}

export default removeTag
