<script setup lang="ts">
import { ref } from 'vue'

import Chart from './components/Chart.vue'
import Sidebar from './components/Sidebar.vue'

const renderChart = ref(false)
</script>

<template>
	<!-- the main things i need to add:

		TODO:
		1) edit the Artist name and album name on the right (wasnt in the og site)
		2) add direct input of an image url instead of the search (for obscure shit)
		3) implement the options stuff
		4) remove album from chart without replacing 
	-->

	<!-- in case the OG site goes down a reference image -->
	<!-- https://i.gyazo.com/9fb8f19495588fd3b31c47389d248bcb.png -->
	<div class="flex">
		<Sidebar
			class="w-1/4 max-w-[480px]"
			@can-render-chart="renderChart = true"
		/>
		<Chart v-if="renderChart" />
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
