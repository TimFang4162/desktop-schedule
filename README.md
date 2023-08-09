# Desktop Schedule 桌面课程表

> An electron-nuxt project

#### Setup the project

```bash
# clone this repo
git clone https://github.com/TimFang4162/desktop-schedule.git

# install dependencies
yarn install

# serve app with hot reload
yarn dev

# build electron application for production
yarn build

# lint all JS/Vue component files in `src/`
yarn lint:fix

```

> Tips
> 不支持 node v17+(由于 OpenSSL 3.0)。最高的可用版本为 node v16
> 在接下来的版本中将会修复此Bug


> Tips
> 设置 npm 和 yarn 国内镜像源
> ```bash
> npm config set registry https://registry.npmmirror.com
> yarn config set registry https://registry.npmmirror.com
> npm config set electron_mirror=https://registry.npmmirror.com/-/binary/electron/
> ```


---

This project was generated with [electron-nuxt](https://github.com/michalzaq12/electron-nuxt) v1.8.1 using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://github.com/michalzaq12/electron-nuxt/blob/master/README.md).
