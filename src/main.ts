import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { version as PackageVersion } from '#root/package.json'
import './uno.css'
import './global.css'
import 'virtual:uno.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.mount('#app')
addVersionMetaTag()

function addVersionMetaTag() {
	const meta = document.createElement('meta')
	meta.name = 'SiteVersion'
	meta.content = PackageVersion
	document.getElementsByTagName('head')[0].appendChild(meta)
}
