/**
 * @flow
 */
import colors from 'colors/safe'

import { push } from '../lib/git'
import { getProjectsDefinition } from '../lib/gitMs'

import type { ProjectType, MicroserviceType } from '../types'

const catchPush = (pushPromise: Function, microservice: MicroserviceType): Promise<> =>
  pushPromise()
    .then((res: any): string => `${colors.grey(microservice.name)}: ${String(res)}\n`)
    .catch((err: Error): string => {
      if (!err.message.includes('Everything up-to-date')) {
        return `${colors.grey(microservice.name)}: ${colors.red(err.message)}\n`
      }
      return `${colors.grey(microservice.name)}: ${err.message}\n`
    })

const handlePromises = async (promises: Promise<>[]): Promise<> => {
  const results = await Promise.all(promises)
  return Promise.resolve(results.join('\n'))
}

const pushProject = async (projectName: string): Promise<> => {
  const { projects } = await getProjectsDefinition()
  const projectToPush = projects.find((project: ProjectType): boolean => project.name === projectName)

  if (!projectToPush) {
    throw new Error(`Project ${projectName} doesn't exists.`)
  }

  const pushJob = projectToPush.microservices.map((microservice: MicroserviceType): Promise<> =>
    catchPush((): Promise<> => push(microservice.path), microservice),
  )

  return handlePromises(pushJob)
}

export default pushProject
