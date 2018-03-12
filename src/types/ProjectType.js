/**
 * @flow
 */

import type { MicroserviceType, TagType } from '.'

export type ProjectType = {
  name: string,
  microservices: MicroserviceType[],
  tags: TagType[]
}
