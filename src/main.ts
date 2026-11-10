import { createApp, vaporInteropPlugin } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { version as PackageVersion } from '#root/package.json'
// oxlint-disable-next-line import/no-unassigned-import
import './uno.css'
// oxlint-disable-next-line import/no-unassigned-import
import './global.css'
// oxlint-disable-next-line import/no-unassigned-import
import 'virtual:uno.css'

const app = createApp(App)
const pinia = createPinia()
app.use(vaporInteropPlugin).use(pinia).mount('#app')
addVersionMetaTag()

function addVersionMetaTag() {
	const meta = document.createElement('meta')
	meta.name = 'SiteVersion'
	meta.content = PackageVersion
	document.getElementsByTagName('head')[0].appendChild(meta)
}
