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
  const data = JSON.parse(fs.readFileSync(
    configPath,
    'utf8'
  ).toString())
  const example = JSON.parse(fs.readFileSync(
    exampleConfigPath,
    'utf8'
  ).toString())
  for (const each in example.settings) {
    if (!(each in data.settings)) {
      data.settings[each] = example.settings[each]
    }
  }
  return data
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
  temp.settings['app.schemaVersion'] = appVersion
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
  const configVersion = config.settings['app.schemaVersion']
    ? config.settings['app.schemaVersion']
    : '0.0.0'
  console.log(config.settings['app.schemaVersion'])
  switch (compareVersion(configVersion, appVersion)) {
  case 1: {
    dialog.showErrorBox('Error',
      `配置文件版本(${configVersion})高于程序版本(${appVersion})，它可能由更新的课程表生成。请下载最新的课程表并重试。`)
    app.exit()
    break
  }

  case -1: {
    console.log('update config')
    if (configVersion === '0.0.0') {
      dialog.showErrorBox('无法更新配置文件', `当前的配置文件由旧版本课程表(${configVersion})生成，无法迁移到新版本。它将会被新版本配置文件覆盖。`)
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
