/**
 * @flow
 */

import execCommand from './execCommand'
import execScript from './execScript'

export {
  execCommand,
  execScript,
}

export default {
  execCommand,
  exec: execScript,
}
