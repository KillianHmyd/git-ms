/**
 * @flow
 */

import colors from 'colors/safe'

import { group } from '../lib/log'
import { execCommand } from '../lib/bash'
import { getProjectsDefinition } from '../lib/gitMs'

import type { ProjectType, MicroserviceType } from '../types'

/**
 * Execute the given promise and catch the results of the command & return them as string.
 * @param   {Function}            execPromise     The promise to execute.
 * @param   {MicroserviceType}    microservice    The microservice on which the command is executed.
 * 
 * @returns {string}                              The results as string.
 */
const catchExec = (execPromise: Function, microservice: MicroserviceType): Promise<> =>
  execPromise()
    .then((res: any): string => {
      let log = ''
      log += group.getString(`${colors.yellow(microservice.name)}: `)
      group.begin()
      log += group.getString(`${String(res)}\n`)
      group.end()
      return log
    })
    .catch((err: Error): string => `${microservice.name}: ${colors.red(err.message)}`)

const handlePromises = async (promises: Promise<>[]): Promise<> => {
  const results = await Promise.all(promises)
  return Promise.resolve(results.join('\n'))
}

/**
 * Exec a bash command on every project's microservice.
 * @param {string} projectName    The project's name.
 * @param {string} commandToExec  The command to execute on the project.
 */
const execProject = async (projectName: string, commandToExec: string): Promise<> => {
  const { projects } = await getProjectsDefinition()
  const projectToExec = projects.find((project: ProjectType): boolean => project.name === projectName)

  if (!projectToExec) {
    throw new Error(`Project ${projectName} doesn't exists.`)
  }

  const execJob = projectToExec.microservices.map((microservice: MicroserviceType): Promise<> =>
    catchExec((): Promise<> => execCommand(`cd ${microservice.path}; ${commandToExec};`), microservice),
  )

  return handlePromises(execJob)
}

export default execProject
