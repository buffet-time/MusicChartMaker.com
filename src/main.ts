import { createApp } from 'vue'
import App from './App.vue'
import { version as PackageVersion } from '#root/package.json'
import './uno.css'
import './global.css'

addVersionMetaTag()
createApp(App).mount('#app')

// adds a meta tag with current package.json version
function addVersionMetaTag() {
	const meta = document.createElement('meta')
	meta.name = 'SiteVersion'
	meta.content = PackageVersion
	document.getElementsByTagName('head')[0].appendChild(meta)
}
