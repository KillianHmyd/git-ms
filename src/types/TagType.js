/**
 * @flow
 */

import type { MicroserviceType } from '.'

export type TagType = {
  name: string,
  microservices: [
    {
      branch: string
    } & MicroserviceType
  ]
}
