<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

defineProps<{
	dialogId: string
	closeButton: boolean
}>()

const currentDialog = useTemplateRef<HTMLDialogElement>('currentDialog')

function closeDialog() {
	currentDialog.value?.close()
}

onMounted(async () => {
	if (!currentDialog.value) {
		return console.error('The passed modal doesnt exist', currentDialog.value)
	}

	if (typeof HTMLDialogElement !== 'function') {
		const link = document.createElement('link')
		link.type = 'text/css'
		link.rel = 'stylesheet'
		link.href = '/dialog-polyfill.css'
		document.head.appendChild(link)

		const { default: dialogPolyfill } = await import('dialog-polyfill')
		dialogPolyfill.registerDialog(currentDialog.value)
	}

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
		<div class="uno-flex-center flex-col gap-2 text-white bg-neutral-700 p-8">
			<slot name="content"></slot>

			<button
				v-if="closeButton"
				role="button"
				class="uno-button mt-4"
				@click="closeDialog"
			>
				Close
			</button>
		</div>
	</dialog>
</template>
