/**
 * @flow
 */

import execCommand from './execCommand'

const exec = (path: string, ...args: string[]): Promise<> => execCommand(`sh ${path} ${args.join(' ')}`, ['-e']).catch((err: Error) => {
  if (err.message.includes(path)) {
    console.error(err)
    throw new Error(err.message.split(':').slice(3).join(':'))
  }

  throw err
})

export default exec

