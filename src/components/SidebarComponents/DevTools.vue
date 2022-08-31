<script setup lang="ts">
import Dialog from '../CoreComponents/Dialog.vue'

const devToolsId = 'devtools'

function openDevToolsModal() {
	// prettier-ignore
	(document.getElementById(devToolsId) as HTMLDialogElement).showModal()
}

function clearLocalStore() {
	if (window.confirm('This deletes all charts and site options')) {
		localStorage.clear()
	}
}
</script>

<template>
	<button class="tw-button mt-2 mx-14" @click="openDevToolsModal">
		Dev Tools
	</button>

	<Dialog :dialog-id="devToolsId" :close-button="true">
		<p class="text-neutral-200">
			Dev debugging tools. Feel free to use them, but be wary :)
		</p>

		<div class="gap-2 flex">
			<div class="flex gap-2">
				<button class="tw-button" @click="clearLocalStore">
					Clear LocalStorage
				</button>
			</div>
		</div>
	</Dialog>
</template>
