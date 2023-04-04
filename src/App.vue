<script setup lang="ts">
import { ref, watch } from 'vue'
import { GlobalSiteOptions } from '#shared/globals'
import { SaveSiteOptions } from '#shared/storage'

import Chart from '#components/Chart.vue'
import Sidebar from '#components/Sidebar.vue'

const renderChart = ref(false)

// TODO: look into feasibility of debouncing this as to reduce ops
watch(
	GlobalSiteOptions,
	() => {
		if (!GlobalSiteOptions.value) {
			return console.error(
				'Error getting GlobalChartState in watch(GlobalChartState)',
				GlobalSiteOptions.value
			)
		}

		SaveSiteOptions()
	},
	{
		deep: true
	}
)
</script>

<template>
	<div class="flex h-screen font-sans text-white antialiased">
		<Sidebar @can-render-chart="renderChart = true" />
		<div class="flex w-full flex-col gap-2">
			<Chart v-if="renderChart" />
		</div>
	</div>
</template>
