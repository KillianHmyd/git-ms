/**
 * @flow
 */

import { getProject, writeSessionFile } from '../lib/gitMs'
import type { ProjectType, SessionType } from '../types'

const createSessionFile = (project: ProjectType): SessionType => ({
  currentProject: project,
})

const useProject = async (projectName?: string): Promise<void> => {
  if (!projectName) {
    throw new Error('Missing project name.')
  }

  const project = await getProject(projectName)
  const sessionToWrite = createSessionFile(project)

  await writeSessionFile(sessionToWrite)
}

export default useProject
