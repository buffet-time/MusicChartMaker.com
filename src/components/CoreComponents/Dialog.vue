<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
	dialogId: string
	closeButton: boolean
}>()

const currentDialog = ref<HTMLDialogElement>()

onMounted(async () => {
	if (!currentDialog.value) {
		return console.error('The passed modal doesnt exist', currentDialog.value)
	}

	// If needed pulls in the dialog polyfill
	if (typeof HTMLDialogElement !== 'function') {
		const { default: dialogPolyfill } = await import('dialog-polyfill')
		dialogPolyfill.registerDialog(currentDialog.value)
	}

	// adds listener to close the dialog when you click outside
	currentDialog.value.addEventListener('click', (event) => {
		if (currentDialog.value?.open && event.target === currentDialog.value) {
			currentDialog.value.close()
			// TODO: cleanup this eventlistener
		}
	})
})
</script>

<template>
	<dialog
		:id="props.dialogId"
		ref="currentDialog"
		class="bg-transparent"
		@keypress.esc="currentDialog!.close()"
	>
		<div
			class="bg-neutral-700 p-5 flex flex-col gap-2 justify-center items-center text-white"
		>
			<!-- Where the override template goes -->
			<slot></slot>

			<!-- Footer -->
			<div v-if="props.closeButton" class="flex gap-2">
				<button class="tw-button" @click="currentDialog!.close()">Close</button>
			</div>
		</div>
	</dialog>
</template>
