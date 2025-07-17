<script setup lang="ts">
import {
	GlobalSiteOptions,
	selectedChartTitle,
	singleChartSelectedChartTitle,
} from '#utils/globals'
import { nextTick, onMounted, watch } from 'vue'

const { initiator, chartNamesArray, chartSelectLabel } = defineProps<{
	initiator: 'MusicChartMakerExport' | 'Sidebar'
	chartNamesArray: string[]
	chartSelectLabel: string
}>()

const emit = defineEmits<{
	onChartSelect: [value: string]
}>()

onMounted(async () => {
	// ensures the StoredChartNames ref is defined
	await nextTick()
	sortStoredChartNames()
	// emit('onChartSelect', selectedChartTitle.value)
})

watch(
	() => GlobalSiteOptions.value.chartTitleSortingMethod,
	() => sortStoredChartNames(),
)

function sortStoredChartNames() {
	switch (GlobalSiteOptions.value.chartTitleSortingMethod) {
		case 'Ascending':
			chartNamesArray.sort()
			break

		case 'Descending':
			chartNamesArray.sort().reverse()
			break

		case 'Least Characters':
			sortByCharacterAmount({ reversed: true })
			break

		case 'Most Characters':
			sortByCharacterAmount({ reversed: false })
			break

		// If the user didn't define it yet set the value to 'Ascending'
		default:
			GlobalSiteOptions.value.chartTitleSortingMethod = 'Ascending'
			break
	}
}

function sortByCharacterAmount({ reversed }: { reversed: boolean }) {
	chartNamesArray.sort((a, b) => {
		{
			switch (true) {
				case a.length > b.length:
					return -1
				case a.length < b.length:
					return 1
				default:
					return 0
			}
		}
	})

	if (reversed) {
		chartNamesArray.reverse()
	}
}
</script>

<template>
	<select
		v-if="initiator === 'Sidebar'"
		v-model="selectedChartTitle"
		class="uno-input global-select uno-select pl-1"
		:name="chartSelectLabel"
		:id="chartSelectLabel"
		@change="emit('onChartSelect', selectedChartTitle)"
	>
		<option v-for="(name, index) in chartNamesArray" :key="index">
			{{ name }}
		</option>
	</select>

	<select
		v-else
		v-model="singleChartSelectedChartTitle"
		class="uno-input global-select uno-select pl-1"
		:name="chartSelectLabel"
		:id="chartSelectLabel"
		@change="emit('onChartSelect', selectedChartTitle)"
	>
		<option v-for="(name, index) in chartNamesArray" :key="index">
			{{ name }}
		</option>
	</select>
</template>
