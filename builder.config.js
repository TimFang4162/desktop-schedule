/* eslint-disable quotes */
module.exports = {
  productName: "Desktop Schedule",
  appId: "com.timfang4162.schedule",
  // eslint-disable-next-line no-template-curly-in-string
  artifactName: "${productName}-${os}-${arch}-setup-${version}.${ext}",
  directories: {
    output: "build"
  },
  // default files: https://www.electron.build/configuration/contents
  files: [
    "package.json",
    {
      from: "dist/main/",
      to: "dist/main/"
    },
    {
      from: "dist/renderer",
      to: "dist/renderer/"
    }
  ],
  extraResources: [
    {
      from: "src/extraResources/",
      to: ""
    }
  ],
  compression: "maximum",
  publish: [],
  win: {
    publisherName: "timmy",
    target: [
      {
        target: "nsis",
        arch: ["x64", "ia32"]
      },
      {
        target: "zip"
      }
    ]
  },

  nsis: {
    differentialPackage: true,
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: true
  },
  linux: {
    target: [{ target: "AppImage" }, { target: "tar.gz" }]
  },
  mac: {
    target: [{ target: "dmg" }, { target: "zip" }]
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: "link",
        path: "/Applications"
      },
      {
        x: 130,
        y: 150,
        type: "file"
      }
    ]
  },
  afterAllArtifactBuild: buildResult => {
    console.log(JSON.stringify(buildResult))
  }
}
