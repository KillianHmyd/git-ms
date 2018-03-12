/**
 * @flow
 */

import { lstatSync, readdirSync } from 'fs'
import { join } from 'path'
import { isRepository } from '.'

const isDirectory = (path: string): boolean => lstatSync(path).isDirectory()

/**
 * Return the path of every repositories at the given path.
 * @param   {string}    path  The path where to search.
 * @returns  {string[]}        The name of the found directories.
 */
const getRepositories = async (path: string): Promise<string[]> => {
  const directories = readdirSync(path)
    .map((name: string): string => join(path, name))
    .filter(isDirectory)

  const repositories = await Promise.all(
    directories.map((directory: string): Promise<Object> =>
      isRepository(directory).then((isRepo: boolean): Object => ({ isRepo, path: directory })),
    ),
  )

  return repositories.filter((repository: Object): boolean => repository.isRepo).map((repository: Object): string => repository.path)
}

export default getRepositories
