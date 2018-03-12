/**
 * @flow
 */
import type { MicroserviceType, TagType } from '../../types'
import { getProject, updateProject } from '.'
import { getCurrentBranch } from '../git'

/**
 * Populate the given microservice with its current branch.
 * 
 * @param {MicroserviceType}  microservice  The microservice to populate.
 * 
 * @returns {branch: string, ...MicroserviceType} The populated microservice.
 */
const populateBranchToMicroservice = async (microservice: MicroserviceType): Promise<{ branch: string } & MicroserviceType> => {
  const branch = await getCurrentBranch(microservice.path)
  return { branch, ...microservice }
}

/**
 * Populate the given microservices with their current branch.
 * 
 * @param {MicroserviceType}  microservices  The microservices to populate.
 * 
 * @returns {branch: string, ...MicroserviceType}[] The populated microservices.
 */
const populateBranchToMicroservices = (microservices: MicroserviceType[]): Promise<Array<{ branch: string } & MicroserviceType>> => {
  const populateJob = microservices.map((microservice: MicroserviceType): Promise<{ branch: string } & MicroserviceType> =>
    populateBranchToMicroservice(microservice),
  )

  return Promise.all(populateJob)
}

/**
 * Create a tag for the given microservices.
 * @param {MicroserviceType[]}  microservices   The microservices.
 * @param {string}              tagName         The tag's name to create.
 * 
 * @returns {TagType}  The created tag.
 */
const createTag = async (microservices: MicroserviceType[], tagName: string): Promise<TagType> => {
  const microservicesWithBranch = await populateBranchToMicroservices(microservices)

  const newTag = {
    name: tagName,
    // $FlowFixMe: Can't understand why Flow doesn't like the following line.
    microservices: microservicesWithBranch,
  }

  return newTag
}

/**
 * Insert a tag in the given project.
 * @param   {string}            projectName         The name of the project in which to create the tag.
 * @param   {string}            tagName             The name of the tag to create.
 */
const insertTag = async (projectName: string, tagName: string): Promise<void> => {
  const project = await getProject(projectName)
  const newTag = await createTag(project.microservices, tagName)

  project.tags.push(newTag)

  await updateProject(project)
}

export default insertTag
