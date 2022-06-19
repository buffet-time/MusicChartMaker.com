<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { ClickOutsideDialog, DynamicImportDialogPolyfill } from '#src/wrappers'

const devToolsModal = ref() as Ref<HTMLDialogElement>

function clearLocalStore() {
	if (window.confirm('This deletes all charts and site options')) {
		localStorage.clear()
	}
}

onMounted(() => {
	DynamicImportDialogPolyfill([devToolsModal.value])
	ClickOutsideDialog(devToolsModal.value)
})
</script>

<template>
	<button class="tw-button mt-2 mx-14" @click="devToolsModal.showModal()">
		Dev Tools
	</button>

	<dialog
		ref="devToolsModal"
		class="bg-transparent"
		@keypress.esc="devToolsModal.close()"
	>
		<div
			class="bg-neutral-700 p-5 flex flex-col gap-2 justify-center items-center"
		>
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

			<div class="flex gap-2">
				<button class="tw-button" @click="devToolsModal.close()">Close</button>
			</div>
		</div>
	</dialog>
</template>
