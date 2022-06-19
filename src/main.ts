import { createApp } from 'vue'
import App from './App.vue'
import './tailwind.css'
import { version as PackageVersion } from '#root/package.json'

const meta = document.createElement('meta')
meta.name = 'SiteVersion'
meta.content = PackageVersion
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
document.getElementsByTagName('head')[0]!.appendChild(meta)

createApp(App).mount('#app')
