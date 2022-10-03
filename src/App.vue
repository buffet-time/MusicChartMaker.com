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
		if (!GlobalSiteOptions) {
			return console.error(
				'Error getting GlobalChartState in watch(GlobalChartState)',
				GlobalSiteOptions
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
	<!-- in case the OG site goes down a reference image -->
	<!-- https://i.gyazo.com/9fb8f19495588fd3b31c47389d248bcb.png -->
	<div class="flex text-white font-sans antialiased h-screen">
		<Sidebar @can-render-chart="renderChart = true" />
		<div>
			<Chart v-if="renderChart" />
		</div>
	</div>
</template>
