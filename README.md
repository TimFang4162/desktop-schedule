# Desktop Schedule  
# 桌面课程表  

一个基于 Electron 的桌面课程表小程序  

## 安装  
```bash
git clone https://github.com/Tim-Fang/desktop-schedule.git
cd desktop-schedule
yarn
yarn start
```

## 构建  
```bash
yarn build
```
Electron-builder 的镜像源配置如下
```json
"build": {
    "electronDownload": {
      "mirror": "https://npm.taobao.org/mirrors/electron/"
    }
}
```
文件将生成在`build`目录下

> Tips:
> ```bash
> npm config set electron_mirror https://mirrors.huaweicloud.com/electron/
> npm config set electron_builder_binaries_mirror https://repo.huaweicloud.com/electron-builder-binaries/
> ```