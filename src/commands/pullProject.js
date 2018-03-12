/**
 * @flow
 */
import colors from 'colors/safe'

import { pull } from '../lib/git'
import { getProjectsDefinition } from '../lib/gitMs'

import type { ProjectType, MicroserviceType } from '../types'

const catchPull = (pullPromise: Function, microservice: MicroserviceType): Promise<string> =>
  pullPromise()
    .then((res: any): string => `${colors.grey(microservice.name)}: ${String(res)}`)
    .catch((err: Error): string => `${colors.grey(microservice.name)}: ${colors.red(err.message)}`)

const handlePromises = async (promises: Promise<>[]): Promise<> => {
  const results = await Promise.all(promises)
  return Promise.resolve(results.join('\n'))
}

const pullProject = async (projectName: string): Promise<> => {
  const { projects } = await getProjectsDefinition()
  const projectToPull = projects.find((project: ProjectType): boolean => project.name === projectName)

  if (!projectToPull) {
    throw new Error(`Project ${projectName} doesn't exists.`)
  }

  const pullJob = projectToPull.microservices.map((microservice: MicroserviceType): Promise<> =>
    catchPull((): Promise<> => pull(microservice.path), microservice),
  )

  return handlePromises(pullJob)
}

export default pullProject
