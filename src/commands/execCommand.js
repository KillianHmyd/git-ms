/**
 * @flow
 */
import path from 'path'

import {
  addMicroservice,
  addProject,
  addTag,
  checkoutProject,
  execProject,
  monitor,
  pullProject,
  pushProject,
  printHelp,
  printMicroservices,
  printProjects,
  removeMicroservice,
  removeProject,
  removeTag,
  useProject,
  useTag,
} from '.'

import { getCurrentProject } from '../lib/gitMs'
import { getRepositories } from '../lib/git'

/**
 * Handle the "add" command. Add a project, microservice or tag.
 *  If "d" or "discover" option is set, create a project with every git repository found in the given path as microservice. The folder name
 * will be the project's name.
 * 
 * @param {string} entityToAdd              The entity to add (project, microservice or tag).
 * @param {string} [projectName]            The name of the project to add or in which to add a microservice/tag.
 * @param {string} [microserviceOrTagName]  The name of the microservice or tag to add.
 * @param {string} [microservicePath]       The path of the microservice to add.
 * @param {Object} opts                     The options of the command. 
 */
const add = async (
  entityToAdd: string,
  projectName?: string,
  microserviceOrTagName?: string,
  microservicePath?: string,
  opts: Object,
): Promise<*> => {
  // With discover option, add every git repo to a project as microservice.
  if (opts.d || opts.discover) {
    const pathToDiscover = opts.discover || opts.d
    const discoveredProjectName = path.basename(pathToDiscover)

    if (!pathToDiscover) throw new Error('Miss the path to discover.')

    await addProject(discoveredProjectName)

    const repositories = await getRepositories(pathToDiscover)

    /* eslint-disable no-restricted-syntax, no-await-in-loop, need to execute these functions in series. */
    for (const repositoryPath of repositories) {
      await addMicroservice(discoveredProjectName, { name: path.basename(repositoryPath), path: repositoryPath })
    }

    return printMicroservices(discoveredProjectName)
  }

  if (!projectName) throw new Error('Missing project name.')

  if (entityToAdd === 'project') {
    return addProject(projectName)
  }

  if (entityToAdd === 'microservice') {
    if (!microserviceOrTagName || !microservicePath) throw new Error(`Missing microservice's ${microserviceOrTagName ? 'path' : 'name'}.`)
    return addMicroservice(projectName, { name: microserviceOrTagName, path: path.resolve(process.cwd(), microservicePath) })
  }

  if (entityToAdd === 'tag') {
    if (!microserviceOrTagName) throw new Error("Missing tag's  name.")
    return addTag(projectName, microserviceOrTagName)
  }

  throw new Error(`Unknown action add ${entityToAdd}.`)
}

/**
 * Handle the command "remove". Remove a project or a microservice.
 * 
 * @param {string} entityToRemove             The entity to remove (project, microservice or tag).
 * @param {string} projectName                The project's name.
 * @param {string} [microserviceOrTagName]    The microservice or tag's name.
 */
const remove = (entityToRemove: string, projectName: string, microserviceOrTagName?: string): Promise<*> => {
  if (!projectName) throw new Error('Missing project name.')

  if (entityToRemove === 'project') {
    return removeProject(projectName)
  }

  if (entityToRemove === 'microservice') {
    return removeMicroservice(projectName, microserviceOrTagName)
  }

  if (entityToRemove === 'tag') {
    return removeTag(projectName, microserviceOrTagName)
  }

  throw new Error(`Unknown action remove ${entityToRemove}.`)
}

/**
 * Handle the command "exec". Exec a bash command on every project's microservice.
 * 
 * @param {string} projectName    The project's name.
 * @param {string} commandToExec  The command to exec.
 */
const exec = (projectName: string, commandToExec: string): Promise<*> => {
  if (!projectName || !commandToExec) throw new Error(`Missing the ${projectName ? 'project name' : 'command to execute'}.`)

  return execProject(projectName, commandToExec)
}

/**
 * Handle the command "tag". Will checkout the microservices on the branch described on the tag.
 * 
 * @param {string} projectName  The project's name.
 * @param {string} tagName      The tag's name.
 */
const tag = (projectName: string, tagName: string): Promise<*> => {
  if (!projectName || !tagName) throw new Error(`Missing the ${projectName ? 'project' : 'tag'} name.`)

  return useTag(projectName, tagName)
}

/**
 * Exec the given function with the given parameters and the project's name given via the option "-p" or "--project".
 * If no project's name is given, use the name of the current project (set via "use <project name>" command).
 * 
 * @param {Function}  functionToExec 
 * @param {string[]}  commandParameters   The input of the cli's user. 
 * @param {Object}    opts                The option given by the cli's user.
 */
const execFunctionWithProjectName = async (functionToExec: Function, commandParameters: string[], opts: Object): Promise<any> => {
  let projectName = opts.project || opts.p

  if (!projectName) {
    const currentProject = await getCurrentProject()
    projectName = currentProject.name
  }

  return functionToExec(projectName, ...commandParameters)
}

const optsToCommand = (command: string, opts: Object): string => {
  if (command) {
    return command
  }

  if (opts.v || opts.version) {
    return 'version'
  }

  return 'help'
}

/**
 * Exec a command using the given parameters and option. 
 * @param {string[]}  [command, ...commandParameters]   The input of the cli's user. 
 * @param {Object}    opts                              The option given by the cli's user.
 */
const execCommand = async ([command, ...commandParameters]: string[], opts: Object): Promise<> => {
  const commandToExec = optsToCommand(command, opts)

  switch (commandToExec) {
    case 'add':
      return add(
        commandParameters[0] /* Entity to add (project, microservice, tag) */,
        commandParameters[1] /* Project Name */,
        commandParameters[2] /* Microservice or tag Name */,
        commandParameters[3] /* Path */,
        opts,
      )
    case 'checkout':
      return execFunctionWithProjectName(checkoutProject, commandParameters, opts)
    case 'ps':
      if (opts.all || opts.a) return printProjects()
      return execFunctionWithProjectName(printMicroservices, commandParameters, opts)
    case 'exec':
      return execFunctionWithProjectName(exec, commandParameters, opts)
    case 'monitor':
      return execFunctionWithProjectName(monitor, commandParameters, opts)
    case 'help':
      return printHelp()
    case 'pull':
      return execFunctionWithProjectName(pullProject, commandParameters, opts)
    case 'push':
      return execFunctionWithProjectName(pushProject, commandParameters, opts)
    case 'remove' || 'rm':
      return remove(commandParameters[0] /* Project Name */, commandParameters[1] /* Microservice name */)
    case 'use':
      return useProject(commandParameters[0])
    case 'tag':
      return execFunctionWithProjectName(tag, commandParameters, opts)
    case 'version':
      return require('../../package.json').version
    default:
      return printHelp()
  }
}

export default execCommand
