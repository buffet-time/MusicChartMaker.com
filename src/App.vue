<script setup lang="ts">
import { ref } from 'vue'
import { GlobalSiteOptions } from './shared'
import { GetSiteOptions } from './storage'

import Chart from './components/Chart.vue'
import Sidebar from './components/Sidebar.vue'

const renderChart = ref(false)

GlobalSiteOptions.value = GetSiteOptions()
</script>

<template>
	<!-- in case the OG site goes down a reference image -->
	<!-- https://i.gyazo.com/9fb8f19495588fd3b31c47389d248bcb.png -->
	<div class="flex text-white text-center font-sans antialiased">
		<Sidebar @can-render-chart="renderChart = true" />
		<Chart v-if="renderChart" />
	</div>
</template>

<style>
body {
	background-color: #303030;
}
</style>
