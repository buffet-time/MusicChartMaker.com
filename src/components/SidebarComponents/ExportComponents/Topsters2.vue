<script setup lang="ts">
import { importFromTopsters2 } from '#utils/importExport/topsters2'
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
				@input="importFromTopsters2"
			/>
		</label>
	</section>
</template>
