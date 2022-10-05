<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps<{
	dialogId: string
	closeButton: boolean
}>()

const currentDialog = ref<HTMLDialogElement>()

function closeDialog() {
	currentDialog.value?.close()
}

onMounted(async () => {
	if (!currentDialog.value) {
		return console.error('The passed modal doesnt exist', currentDialog.value)
	}

	// If needed pulls in the dialog polyfill
	if (typeof HTMLDialogElement !== 'function') {
		const { default: dialogPolyfill } = await import('dialog-polyfill')
		dialogPolyfill.registerDialog(currentDialog.value)
	}

	// adds listener to close the dialog when you start a click outside
	// mousedown in case you are click dragging and end up just outside
	// it then would feel like a bug
	currentDialog.value.addEventListener('mousedown', (event) => {
		if (currentDialog.value?.open && event.target === currentDialog.value) {
			// TODO: maybe look into cleaning up listeners on dialogs
			// there's only a few so it shouldn't be too big of a cpu or ram hit.
			closeDialog()
		}
	})
})
</script>

<template>
	<dialog
		:id="dialogId"
		ref="currentDialog"
		class="bg-transparent"
		@keypress.esc="closeDialog"
	>
		<div class="bg-neutral-700 p-5 tw-flex-center flex-col gap-2 text-white">
			<!-- Where the override template goes -->
			<slot name="content"></slot>

			<!-- Footer -->
			<button v-if="closeButton" class="tw-button mt-1" @click="closeDialog">
				Close
			</button>
		</div>
	</dialog>
</template>
