<script setup lang="ts">
import Dialog from '#core/Dialog.vue'

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

<template>
	<div>
		<button class="tw-button mx-14" @click="openDevToolsModal">
			Dev Tools
		</button>

		<Dialog :dialog-id="devToolsId" :close-button="true">
			<template #content>
				<p class="text-neutral-200">
					Dev debugging tools. Feel free to use them, but be wary :)
				</p>

				<div class="flex gap-2">
					<div class="flex gap-2">
						<button class="tw-button" @click="clearLocalStore">
							Clear LocalStorage
						</button>
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>
