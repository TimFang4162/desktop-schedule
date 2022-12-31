import path from 'path'
const fs = require('fs')
const { app, dialog } = require('electron')

export const compareVersion = (preVersion = '', lastVersion = '') => {
  const sources = preVersion.split('.')
  const dests = lastVersion.split('.')
  const maxL = Math.max(sources.length, dests.length)
  let result = 0
  for (let i = 0; i < maxL; i++) {
    const preValue = sources.length > i ? sources[i] : 0
    const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue)
    const lastValue = dests.length > i ? dests[i] : 0
    const lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue)
    if (preNum < lastNum) {
      result = -1
      break
    } else if (preNum > lastNum) {
      result = 1
      break
    }
  }
  return result
}

export const getResPath = (filename = '') => {
  return app.isPackaged
    ? path.join(__dirname, '../../../', filename)
    : path.join(__dirname, '../extraResources/', filename)
}

const configPath = path.join(app.getPath('userData'), 'schedule-config.json')
const exampleConfigPath = getResPath('example-config.json')
const metadataPath = getResPath('meta.json')
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
const appVersion = metadata.appVersion

export const getMetadata = () => {
  return metadata
}

export const readConfig = () => {
  const data = fs.readFileSync(
    configPath,
    'utf8'
  )
  return JSON.parse(data.toString())
}

export const saveConfig = data => {
  fs.writeFileSync(
    configPath,
    JSON.stringify(data),
    'utf8'
  )
}

export const removeConfig = () => {
  fs.rmSync(configPath, { force: true })
}

export const saveConfigVersionNumber = () => {
  const temp = readConfig()
  temp.config.schemaVersion = appVersion
  saveConfig(temp)
}

function checkConfigExists () {
  const isExists = fs.existsSync(configPath)
  if (isExists) {
    console.log('Config file exists.')
  } else {
    console.warn("Can't find config file!")
    const example = fs.readFileSync(exampleConfigPath, 'utf8')
    // console.log(example)
    fs.writeFileSync(
      configPath,
      example.toString(),
      'utf8'
    )
    saveConfigVersionNumber()
    console.log('Config file generated.')
  }
}

export const migrateConfig = () => {
  checkConfigExists()
  const config = readConfig()
  const configVersion = config.config.schemaVersion
    ? config.config.schemaVersion
    : '0.0.0'
  switch (compareVersion(configVersion, appVersion)) {
  case 1: {
    dialog.showErrorBox('Error',
      `The version of the config file(${configVersion}) is higher than the program version(&{appVersion}). Please download the latest version and try again.`)
    app.exit()
    break
  }

  case -1: {
    console.log('update config')
    if (configVersion === '0.0.0') {
      dialog.showErrorBox('Failed to migrate config', `The version of the config file(${configVersion}) cannot be migrated. It will be overwritten with the latest config file.`)
      removeConfig()
      checkConfigExists()
    } else {
      // console.log(Object.assign(config, { config: { schemaVersion: '0.0.4' } }))
      saveConfigVersionNumber()
    }
    break
  }

  case 0: {
    return config
  }
  }
}

export const setStartWithSystem = bool => {
  app.setLoginItemSettings({
    openAtLogin: bool
  })
}
