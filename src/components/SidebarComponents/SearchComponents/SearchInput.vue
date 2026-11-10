<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
	showSearchResults: boolean
}>()

const emit = defineEmits<{
	search: [value: string]
	updateShowSearchResults: [value: boolean]
}>()

const searchInput = ref('')
</script>

<template>
	<div>
		<label>Search/ Image URL: </label>
		<div class="uno-flex-center flex-col gap-2">
			<input
				v-model="searchInput"
				class="uno-input p-2"
				type="search"
				placeholder="Search input"
				@keyup.enter.prevent="emit('search', searchInput)"
			/>
			<div class="flex gap-1">
				<button
					class="uno-button"
					type="button"
					:disabled="searchInput === ''"
					@click="emit('search', searchInput)"
				>
					search
				</button>
				<button
					class="uno-button"
					type="button"
					:disabled="!showSearchResults"
					@click="emit('updateShowSearchResults', false)"
				>
					clear results
				</button>
			</div>
		</div>
	</div>
</template>
