/**
 * @flow
 */
import colors from 'colors/safe'

import { checkout } from '../lib/git'
import { getTag } from '../lib/gitMs'

import type { MicroserviceType } from '../types'

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

const useTag = async (projectName: string, tagName: string): Promise<> => {
  const tag = await getTag(projectName, tagName)

  const checkoutJob = tag.microservices.map((microservice: { branch: string } & MicroserviceType): Promise<> =>
    catchCheckout((): Promise<> => checkout(microservice.path, microservice.branch), microservice),
  )

  return handlePromises(checkoutJob)
}

export default useTag
