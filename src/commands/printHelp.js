/**
 * @flow
 */
import { group } from '../lib/log'

const nbIndentations = 5
const indentation = '   '

const generateIndentations = (): string =>
  [...Array(nbIndentations).keys()].reduce((previous: string): string => `${previous}${indentation}`, '')

const formatLine = (title: string, description: string): string => `${title}${generateIndentations()}${description}`

const printHelp = () => {
  group.begin()
  // Usage
  group.log('Usage: git-ms <cmd> [<arg>] [<opt>]')

  // Options
  group.log('Options')
  group.begin()
  group.log(formatLine('--all -a', 'Print all the projects.'))
  group.log(formatLine('--version -v', 'Output the version.'))
  group.log(formatLine('--discover -d', 'Add a project by discovering the given path.'))
  group.log(formatLine('--project -p', 'Execute the command on the given project.'))
  group.end()

  // Commands
  group.log('Commands')
  group.begin()
  group.log(
    formatLine(
      'add <entity_to_add> [<project_name>] [<microservice_or_tag_name>] [<microservice_path>]',
      'Add a project or a Microservices or a Tag to a project`',
    ),
  )
  group.log(
    formatLine(
      'remove <entity_to_remove> [<project_name>] [<microservice_or_tag_name>] [<microservice_path>]',
      'Remove a project or a Microservices or a Tag to a project`',
    ),
  )
  group.log(
    formatLine(
      'ps',
      'Print the project. Print all the projects with "--all" option..`',
    ),
  )
  group.log(
    formatLine(
      'exec',
      'Exec a bash command on the project.',
    ),
  )
  group.log(
    formatLine(
      'monitor',
      'Launch the project monitoring.',
    ),
  )
  group.log(
    formatLine(
      'help',
      'Show the help.',
    ),
  )
  group.log(
    formatLine(
      'pull',
      'Pull the project.',
    ),
  )
  group.log(
    formatLine(
      'push',
      'Push the project.',
    ),
  )
  group.log(
    formatLine(
      'use <project_name>',
      'Set the project as current project.',
    ),
  )
  group.log(
    formatLine(
      'tag <tag_name>',
      'Set the project on the given tag.',
    ),
  )
  group.log(
    formatLine(
      'version',
      'Show the version.',
    ),
  )
  group.log(
    formatLine(
      'checkout <branch_name>',
      'Checkotu every microservice on the given branch.',
    ),
  )
  group.end()

  group.end()
}

export default printHelp
