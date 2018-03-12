/**
 * @flow
 */

import colors from 'colors/safe'
import { execCommand } from './commands'

export default async (args: string[], opts: Object): Promise<void> => {
  execCommand(args, opts)
    .then((log: any) => {
      if (log) {
        console.log(String(log))
      }
      process.exit()
    })
    .catch((err: Error) => {
      console.error(colors.red(err.message || err))
      process.exit(1)
    })
}
