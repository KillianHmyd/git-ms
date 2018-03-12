/**
 * @flow
 */

import { spawn } from 'child_process'

const exec = (command: string, options: string[] = []): Promise<> =>
  new Promise((resolve: any, reject: any) => {
    const ls = spawn(command, options, { shell: true })

    let error
    let toReturn

    ls.stdout.on('data', (data: any) => {
      toReturn = data.toString('utf8').trim()
    })

    ls.stderr.on('data', (data: any) => {
      error = new Error(data.toString('utf8').trim())
    })

    ls.on('exit', () => {
      setTimeout(() => {
        if (error) {
          reject(error)
        } else {
          resolve(toReturn)
        }
      }, 50)
    })
  })

export default exec
