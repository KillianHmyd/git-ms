/**
 * @flow
 */
import colors from 'colors/safe'

import { checkout } from '../lib/git'
import { getProjectsDefinition } from '../lib/gitMs'

import type { ProjectType, MicroserviceType } from '../types'

/**
 * The command "git checkout" always write on STDERR. Catch this error.
 * @param {Promise<>}    checkoutPromise      The promise to catch.
 */
const catchCheckout = (checkoutPromise: Function, microservice: MicroserviceType): Promise<> =>
  checkoutPromise()
    .then((res: any): string => `${colors.grey(microservice.name)}: ${String(res)}`)
    .catch((err: Error): string => {
      if (err.message.includes('Switched to branch') || err.message.includes('Already on')) {
        return `${colors.grey(microservice.name)}: ${String(err.message)}`
      }
      return colors.red(`${colors.grey(microservice.name)}: ${err.message}`)
    })

const handlePromises = async (promises: Promise<>[]): Promise<> => {
  const results = await Promise.all(promises)
  return Promise.resolve(results.join('\n'))
}

/**
 * Checkout every microservice of the given project to the given branch.
 * @param {string} projectName  The name of the project to checkout.
 * @param {string} branch       The name of the branch.
 */
const checkoutProject = async (projectName: string, branch: string): Promise<> => {
  const { projects } = await getProjectsDefinition()
  const projectToCheckout = projects.find((project: ProjectType): boolean => project.name === projectName)

  if (!projectToCheckout) {
    throw new Error(`Project ${projectName} doesn't exists.`)
  }

  const checkoutJob = projectToCheckout.microservices.map((microservice: MicroserviceType): Promise<> =>
    catchCheckout((): Promise<> => checkout(microservice.path, branch), microservice),
  )

  return handlePromises(checkoutJob)
}

export default checkoutProject
