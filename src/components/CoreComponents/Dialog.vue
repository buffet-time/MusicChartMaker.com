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
		// adds the folllowing to the head of the document
		// <link rel="stylesheet" type="text/css" href="/dialog-polyfill.css" />
		const link = document.createElement('link')
		link.type = 'text/css'
		link.rel = 'stylesheet'
		link.href = '/dialog-polyfill.css'
		document.head.appendChild(link)

		const { default: dialogPolyfill } = await import('dialog-polyfill')
		dialogPolyfill.registerDialog(currentDialog.value)
	}

	// adds listener to close the dialog when you start a click outside
	currentDialog.value.addEventListener('mousedown', (event) => {
		if (currentDialog.value?.open && event.target === currentDialog.value) {
			closeDialog()
		}
	})
})
</script>

<template>
	<dialog
		:id="dialogId"
		ref="currentDialog"
		class="bg-transparent border-transparent"
		@keypress.esc="closeDialog"
	>
		<div class="tw-flex-center flex-col gap-2 text-white bg-neutral-700 p-8">
			<!-- TODO: https://blog.vuejs.org/posts/vue-3-3#typed-slots-with-defineslots -->
			<slot name="content"></slot>

			<!-- Footer -->
			<button v-if="closeButton" class="tw-button mt-4" @click="closeDialog">
				Close
			</button>
		</div>
	</dialog>
</template>
