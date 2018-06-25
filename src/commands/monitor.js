import blessed from 'blessed'
import contrib from 'blessed-contrib'
import colors from 'colors/safe'
import { checkoutProject, execProject, pushProject, pullProject, useTag, addTag } from '.'

import { getProject, getMicroserviceInfo, getProjectBranches, getTags } from '../lib/gitMs'

// Monitor screen properties
let mainScreen
let grid

// State properties
let pendingAction = false // True if an action in pending.

/**
 * Catch an error and log it in the output box.
 * @param {Object}  outputBox   The output bow in which to log th errors.
 * @param {Error}   err         The error to log.
 */
const catchLogs = (outputBox, err) => outputBox.log(colors.red(err.message))

/**
 * Load the repository table. Get the states of every microservices and print them in the repository table.
 * @param {string}  projectName   The name of the project to load.
 * @param {Object}  outputBox     The output box in which to log the results.
 */
const loadRepoTable = async (projectName, outputBox) => {
  outputBox.log('Loading the project.')
  const { microservices } = await getProject(projectName)

  const microservicesInfo = await Promise.all(microservices.map(microservice => getMicroserviceInfo(projectName, microservice.name)))

  const padEndPath = Math.max(25, ...microservicesInfo.map(microserviceInfo => microserviceInfo.path.length))
  const padEndName = Math.max(10, ...microservicesInfo.map(microserviceInfo => microserviceInfo.name.length))
  const padEndBranch = Math.max(20, ...microservicesInfo.map(microserviceInfo => microserviceInfo.branch.length))
  const padEndStatus = Math.max(10, ...microservicesInfo.map(microserviceInfo => microserviceInfo.status.length))
  const padEndUntracked = Math.max(0, ...microservicesInfo.map(microserviceInfo => microserviceInfo.untracked.length))

  const reposListTable = grid.set(0, 0, 8, 10, contrib.table, {
    label: 'Repositories list',
    interactive: false,
    fg: 'white',
    columnSpacing: 2, // in chars
    columnWidth: [padEndPath, padEndName, padEndBranch, padEndStatus, padEndUntracked] /* in chars */,
  })

  const tableHeaders = ['Path', 'Repository', 'Branch', 'Status', 'Additional']

  const tableData = microservicesInfo.map(microserviceInfo => {
    const { path, name, branch, status, untracked } = microserviceInfo
    return [path, name, branch, status, untracked]
  })

  reposListTable.setData({ headers: tableHeaders, data: tableData })

  mainScreen.render()
  outputBox.log('Project loaded.')
}

/**
 * Pull the given project and log the results in the output box.
 *
 * @param {Object} outputBox    The outputBox chere to log the results.
 * @param {string} projectName  The project's name to pull.
 */
const handlePull = async (outputBox, projectName) => {
  const resultsPull = await pullProject(projectName)

  const logsToPrint = resultsPull.split('\n')
  logsToPrint.forEach(log => outputBox.log(log))
}

/**
 * Push the given project and log the results in the output box.
 *
 * @param {Object} outputBox    The outputBox chere to log the results.
 * @param {string} projectName  The project's name to push.
 */
const handlePush = async (outputBox, projectName) => {
  const resultsPull = await pushProject(projectName)

  const logsToPrint = resultsPull.split('\n')
  logsToPrint.forEach(log => outputBox.log(log))
}

/**
 * Load the action box with the default actions (PUSH, PULL, CHECKOUT, EXEC).
 *
 * @returns {Object}   The loaded action box.
 */
const loadActionBox = () => {
  const actionBox = grid.set(0, 10, 8, 2, blessed.list, {
    label: 'Actions',
    interactive: true,
    keys: true,
    vi: true,
    items: ['PULL', 'PUSH', 'CHECKOUT', 'CREATE TAG', 'USE TAG', 'EXEC'],
    style: {
      selected: {
        bg: 'blue',
      },
    },
  })

  actionBox.focus()

  return actionBox
}

/**
 * Handle the search on lists. Show an input box to write the researched element.
 * 
 * @param {Function}  callback  Function called with the researched string.
 */
const handleSearch = async (parentComponent, callback) => {
  const searchInputBox = grid.set(7, 10, 1, 2, blessed.textbox, {
    label: 'Researched element',
    keys: true,
    inputOnFocus: true,
  })

  searchInputBox.on('cancel', () => {
    searchInputBox.hide()
    mainScreen.render()
  })

  searchInputBox.focus()
  mainScreen.render()
  searchInputBox.on('submit', researchedString => {
    searchInputBox.hide()
    parentComponent.focus()
    callback(null, researchedString)
    mainScreen.render()
  })
}

const loadCheckoutBox = branches => {
  const checkoutBox = grid.set(0, 10, 8, 2, blessed.list, {
    label: 'Actions',
    interactive: true,
    keys: true,
    vi: true,
    search: (callback) => handleSearch(checkoutBox, callback),
    items: branches,
    style: {
      selected: {
        bg: 'blue',
      },
    },
  })

  checkoutBox.focus()
  mainScreen.render()

  return checkoutBox
}

/**
 * Handle the checkout choice. Checkout all the microservices on the choosen branch.
 * @param {string} projectName    The project to checkout.
 * @param {string} choosenBranch  The branch on which to checkout.
 * @param {Object} outputBox      The output box in which to log the results.
 */
const handleCheckoutChoice = async (projectName, choosenBranch, outputBox, checkoutBox) => {
  pendingAction = true
  const resultCheckout = await checkoutProject(projectName, choosenBranch)

  const resultsCheckout = resultCheckout.split('\n')
  resultsCheckout.forEach(result => outputBox.log(result))
  await loadRepoTable(projectName, outputBox)

  pendingAction = false
  checkoutBox.hide()
  mainScreen.render()
}

/**
 * Handle the checkout action. Set in the action box every possible branches for the given project.
 * @param {Object} outputBox    The output box in which to log the results.
 * @param {string} projectName  The project's name to checkout.
 */
const handleCheckout = async (outputBox, projectName) => {
  const projectBranches = await getProjectBranches(projectName)
  const checkoutBox = loadCheckoutBox(projectBranches)

  checkoutBox.on('select', ({ content: choosenBranch }) => {
    if (!pendingAction) {
      handleCheckoutChoice(projectName, choosenBranch, outputBox, checkoutBox)
    }
  })

  checkoutBox.on('cancel', () => {
    pendingAction = false
    checkoutBox.hide()
    mainScreen.render()
  })
}

/**
 * Handle the tag choice.
 * @param {string} projectName    The project to checkout.
 * @param {string} choosenTag     The tag to use.
 * @param {Object} outputBox      The output box in which to log the results.
 */
const handleTagChoice = async (projectName, choosenTag, outputBox, tagBox) => {
  pendingAction = true
  const resultCheckout = await useTag(projectName, choosenTag)

  const resultsCheckout = resultCheckout.split('\n')
  resultsCheckout.forEach(result => outputBox.log(result))
  await loadRepoTable(projectName, outputBox)
  tagBox.hide()
  mainScreen.render()
  pendingAction = false
}

const loadTagBox = tags => {
  const tagsName = tags.map(tag => tag.name)
  const tagBox = grid.set(0, 10, 8, 2, blessed.list, {
    label: 'Actions',
    interactive: true,
    keys: true,
    vi: true,
    search: (callback) => handleSearch(tagBox, callback),
    items: tagsName,
    style: {
      selected: {
        bg: 'blue',
      },
    },
  })

  tagBox.focus()
  mainScreen.render()

  return tagBox
}

/**
 * Handle the use tag action. Set in the action box every possible tag for the given project.
 * @param {Object} outputBox    The output box in which to log the results.
 * @param {string} projectName  The project's name to checkout.
 */
const handleUseTag = async (outputBox, projectName) => {
  const tags = await getTags(projectName)
  const tagBox = loadTagBox(tags)

  tagBox.on('select', ({ content: choosenBranch }) => {
    if (!pendingAction) {
      handleTagChoice(projectName, choosenBranch, outputBox, tagBox)
    }
  })

  tagBox.on('cancel', () => {
    pendingAction = false
    tagBox.hide()
    mainScreen.render()
  })
}

/**
 * Handle create tag action. Show an input box to write the name of the tag to create.
 *
 * @param {Object} outputBox    The output box in which to log the results.
 * @param {string} projectName  The name of the project on which create a tag.
 */
const handleCreateTag = async (outputBox, projectName) => {
  const tagInputBox = grid.set(6, 10, 2, 2, blessed.textbox, {
    label: 'Tag name',
    keys: true,
    inputOnFocus: true,
  })

  tagInputBox.focus()
  mainScreen.render()

  tagInputBox.on('submit', async tagName => {
    await addTag(projectName, tagName)
      .then(() => outputBox.log(`Tag ${tagName} created`))
      .catch(err => catchLogs(outputBox, err))
    tagInputBox.hide()
    mainScreen.render()
  })

  tagInputBox.on('cancel', () => {
    tagInputBox.hide()
    mainScreen.render()
  })
}

/**
 * Handle create tag action. Show an input box to write the name of the tag to create.
 *
 * @param {Object} outputBox    The output box in which to log the results.
 * @param {string} projectName  The name of the project on which create a tag.
 */
const handleExec = async (outputBox, projectName) => {
  const execInputBox = grid.set(6, 10, 2, 2, blessed.textbox, {
    label: 'Command to exec',
    keys: true,
    inputOnFocus: true,
  })

  execInputBox.focus()
  mainScreen.render()

  execInputBox.on('submit', async commandToExec => {
    pendingAction = true

    await execProject(projectName, commandToExec)
      .then(res => res.split('\n').forEach(log => outputBox.log(log)))
      .then(() => outputBox.log(`Command ${commandToExec} executed`))
      .catch(err => catchLogs(outputBox, err))

    pendingAction = false
    execInputBox.hide()
    mainScreen.render()
  })

  execInputBox.on('cancel', () => {
    execInputBox.hide()
    mainScreen.render()
  })
}

/**
 * Handle the choosen action.
 * @param {Object} outputBox    The output box in which to log the results.
 * @param {string} projectName  The project's name on which to execute the action.
 * @param {string} actionName   The action to execute.
 */
const handleAction = async (outputBox, projectName, actionName) => {
  if (pendingAction) {
    outputBox.log(colors.red('An action is already running'))
    return
  }

  pendingAction = true

  switch (actionName) {
    case 'PULL':
      outputBox.log('Pulling...')
      await handlePull(outputBox, projectName)
        .then(() => outputBox.log('Pull with success.'))
        .catch(() => catchLogs(outputBox))
      break
    case 'PUSH':
      outputBox.log('Pushing...')
      await handlePush(outputBox, projectName)
        .then(() => outputBox.log('Push with success.'))
        .catch(() => catchLogs(outputBox))
      break
    case 'CHECKOUT':
      await handleCheckout(outputBox, projectName)
      break
    case 'USE TAG':
      await handleUseTag(outputBox, projectName)
      break
    case 'CREATE TAG':
      await handleCreateTag(outputBox, projectName)
      break
    case 'EXEC':
      await handleExec(outputBox, projectName)
      break
    default:
      outputBox.log(colors.red('Unknown action.'))
      break
  }

  pendingAction = false
}

/**
 * Load the output box.
 */
const loadOutputBox = () =>
  grid.set(8, 0, 4, 8, contrib.log, {
    fg: 'white',
    label: 'Output',
    interactive: true,
    keys: true,
  })

/**
 * Load the about box.
 *
 * @returns {Object} The loaded about box.
 */
const loadAboutBox = () => {
  const aboutBox = grid.set(8, 8, 4, 4, blessed.box, { label: 'About' })

  aboutBox.insertLine(0, `${'Current directory:'}`)
  aboutBox.insertLine(2, `${'Controls List:'}`)
  aboutBox.insertLine(3, '-----------------------------------')
  aboutBox.insertLine(4, `${'Refresh repositories:'} Control+r or r`)
  aboutBox.insertLine(4, `${'Cancel action:'} ESC`)
  aboutBox.insertLine(5, `${'Quit:'} Control+c or q`)

  return aboutBox
}

/**
 * Start the monitor screen for the given project.
 * @param {string} projectName  The project's name to monitor.
 */
const monitor = projectName =>
  new Promise(async resolve => {
    mainScreen = blessed.screen({
      ullUnicode: true,
      smartCSR: true,
      autoPadding: true,
      title: 'Git Terminal',
    })

    // Configuring the layout
    /* eslint-disable new-cap */
    grid = new contrib.grid({ rows: 12, cols: 12, screen: mainScreen })
    const outputBox = loadOutputBox()
    const actionBox = loadActionBox()
    loadAboutBox()

    loadRepoTable(projectName, outputBox).catch(catchLogs.bind(null, outputBox))

    mainScreen.key(['q', 'C-c'], () => resolve())
    mainScreen.key(['r', 'C-r'], () => loadRepoTable(projectName, outputBox))

    actionBox.on('select', ({ content: actionName }) => handleAction(outputBox, projectName, actionName))
  })

export default monitor
