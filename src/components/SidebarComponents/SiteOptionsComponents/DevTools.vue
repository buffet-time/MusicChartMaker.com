<script setup lang="ts">
import Dialog from '#core/Dialog.vue'
import { GlobalSiteOptions } from '#utils/globals'
import { SaveSiteOptions } from '#utils/storage'
import { ref } from 'vue'
import type { SiteOptions } from '#types'

const HackJobLol: SiteOptions = {
	numberOfSearchResults: 1,
	currentChart: '',
	fontCache: [''],
	presets: [],
	hideTooltip: true,
	chartTitleSortingMethod: 'Ascending',
}
const siteOptionsValues = Object.keys(HackJobLol)

const devToolsId = 'devtools'

const globalSiteOptionKey = ref('chartTitleSortingMethod')
const changeValue = ref('')

function openDevToolsModal() {
	const devTools = document.getElementById(devToolsId) as HTMLDialogElement
	devTools.showModal()
}

function clearLocalStore() {
	if (window.confirm('This deletes all charts and site options')) {
		localStorage.clear()
	}
}

function changeValueOfGlobalSiteOptionsKey() {
	if (window.confirm('This can mess up the site')) {
		// @ts-expect-error - im doing fucky bullshit
		GlobalSiteOptions.value[globalSiteOptionKey.value] = changeValue.value
		SaveSiteOptions()
	}
}
</script>

<template>
	<div class="pt-4">
		<button class="uno-button mx-14" @click="openDevToolsModal">
			Dev Tools
		</button>

		<Dialog :dialog-id="devToolsId" :close-button="true">
			<template #content>
				<p class="text-neutral-200">
					Dev debugging tools. Feel free to use them, but be wary :)
				</p>

				<div class="flex gap-2">
					<div class="flex gap-2">
						<button class="uno-button" @click="clearLocalStore">
							Clear LocalStorage
						</button>
					</div>
				</div>

				<div class="flex gap-2">
					<div class="flex gap-2">
						<select
							v-model="globalSiteOptionKey"
							placeholder="Key value"
							type="text"
							class="cursor-pointer uno-input w-auto"
						>
							<option v-for="(val, index) in siteOptionsValues" :key="index">
								{{ val }}
							</option>
						</select>
						<input
							v-model="changeValue"
							type="text"
							placeholder="value"
							class="uno-input w-[unset]"
						/>
						<button
							class="uno-button"
							@click="changeValueOfGlobalSiteOptionsKey"
						>
							Change GlobalSiteOptions Value
						</button>
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>
