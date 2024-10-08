<script setup lang="ts">
import { ref } from 'vue'
import { GlobalSiteOptions } from '#utils/globals'

import Dialog from '#core/Dialog.vue'

const showChartOptions = ref(false)

const devToolsId = 'devtools'

function openDevToolsModal() {
	const devTools = document.getElementById(devToolsId) as HTMLDialogElement
	devTools.showModal()
}

function clearLocalStore() {
	if (window.confirm('This deletes all charts and site options')) {
		localStorage.clear()
	}
}
</script>

<!-- TODO: add site level styling options for users -->
<template>
	<div>
		<!-- in the sidebar -->
		<div class="uno-flex-center gap-2">
			<button
				type="button"
				class="uno-button flex w-10/12 items-center gap-2"
				@click="showChartOptions = true"
			>
				<img
					title="Open in window icon"
					alt="open in window icon"
					src="/openInWindow.svg"
					width="25"
					height="25"
					class="cursor-pointer bg-neutral-500"
					loading="lazy"
				/>
				<label class="cursor-pointer pb-[2px]"> Site Options </label>
			</button>
		</div>

		<!-- The options overlay -->
		<div
			v-if="showChartOptions"
			class="uno-options-overlay-div uno-sidebar-width p-0"
		>
			<div class="px-2 flex flex-col">
				<img
					title="Close Options"
					alt="close-button"
					src="/back.svg"
					width="25"
					height="25"
					class="absolute left-0 m-[6px] mt-[6px] cursor-pointer bg-neutral-500"
					loading="lazy"
					@click="showChartOptions = false"
				/>

				<label class="mt-8">
					# of Search Results: {{ GlobalSiteOptions?.numberOfSearchResults }}
				</label>
				<input
					v-model="GlobalSiteOptions!.numberOfSearchResults"
					class="cursor-pointer"
					type="range"
					min="10"
					max="50"
					step="1"
				/>

				<div class="uno-options-div">
					<label>Hide search tooltip</label>
					<input
						v-model="GlobalSiteOptions.hideTooltip"
						type="checkbox"
						class="uno-checkbox cursor-pointer"
					/>
				</div>

				<div class="pt-2">
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
						</template>
					</Dialog>
				</div>
			</div>
		</div>
	</div>
</template>
