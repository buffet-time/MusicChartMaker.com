<script setup lang="ts">
import { nextTick, onMounted } from 'vue'

let callImportFromTopsters2AfterPiniaIsReady: (event: Event) => void

onMounted(async () => {
	await nextTick()
	const { importFromTopsters2 } = await import('#utils/importExport/topsters2')
	callImportFromTopsters2AfterPiniaIsReady = importFromTopsters2
})

function handleImport(event: Event) {
	callImportFromTopsters2AfterPiniaIsReady(event)
}
</script>

<template>
	<section class="my-2 flex flex-col gap-2">
		<h1 class="text-xl m-0">From Topsters 2</h1>
		<label for="topsters2-file-picker" class="uno-button block">
			Import a Chart
			<input
				id="topsters2-file-picker"
				ref="topsters2-filePicker"
				type="file"
				accept=".json"
				class="hidden"
				@input="(event) => handleImport(event)"
			/>
		</label>
	</section>
</template>
