const windowsOS = {
  win: {
    publisherName: 'michal',
    target: 'nsis'
  },

  nsis: {
    differentialPackage: true,
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: true
  }
}

const linuxOS = {
  linux: {
    target: 'deb'
  }
}

const macOS = {
  mac: {
    target: 'dmg'
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications'
      },
      {
        x: 130,
        y: 150,
        type: 'file'
      }
    ]
  }
}

module.exports = {
  productName: 'Desktop Schedule',
  appId: 'com.timfang4162.schedule',
  // eslint-disable-next-line no-template-curly-in-string
  artifactName: '${productName}-setup-${version}.${ext}',
  directories: {
    output: 'build'
  },
  // default files: https://www.electron.build/configuration/contents
  files: [
    'package.json',
    {
      from: 'dist/main/',
      to: 'dist/main/'
    },
    {
      from: 'dist/renderer',
      to: 'dist/renderer/'
    }
  ],
  extraResources: [
    {
      from: 'src/extraResources/',
      to: ''
    }
  ],
  ...windowsOS,
  ...linuxOS,
  ...macOS
}
