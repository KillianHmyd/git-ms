/**
 * @flow
 */

let nbIndentation = 0
const indent = '  '

const formatString = (string: string): string =>
  string.replace(
    /^/gm,
    nbIndentation > 0 ? [...Array(nbIndentation).keys()].reduce((previousValue: string): string => `${previousValue}${indent}`, '') : '',
  )

const log = (args: any): boolean => process.stdout.write(`${formatString(String(args))}\n`)

const getString = (args: any): string => `${formatString(String(args))}\n`

const begin = () => {
  nbIndentation += 1
}

const end = () => {
  nbIndentation -= 1
}

export {
  log,
  begin,
  end,
  getString,
}

export default {
  log,
  begin,
  end,
  getString,
}
