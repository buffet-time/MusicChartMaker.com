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
	<!-- the main things i need to add:

		MVP: 
		1) remove album from chart without replacing 

		TODO after MVP:
		1) add a modal for tips on less obvious functionality
		2) Fix clicking anywhere below the titles triggereing content editable
		3) text font/ size change options

		A) options to set how many albums in a row
			1) default options for top 10, top 25, top 50, top 100
	-->

	<!-- in case the OG site goes down a reference image -->
	<!-- https://i.gyazo.com/9fb8f19495588fd3b31c47389d248bcb.png -->
	<div class="flex">
		<Sidebar
			class="w-1/5 max-w-[480px]"
			@can-render-chart="renderChart = true"
		/>
		<Chart v-if="renderChart" id="Chart" class="w-4/5" />
	</div>
</template>

<style>
body {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background-color: #303030;
	color: white;
	text-align: center;
	margin-top: 60px;
}
</style>
