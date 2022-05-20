<script setup lang="ts">
import { ref } from 'vue'

import Chart from './components/Chart.vue'
import Sidebar from './components/Sidebar.vue'

const renderChart = ref(false)
</script>

<template>
	<div class="flex">
		<Sidebar class="w-2/5" @can-render-chart="renderChart = true" />
		<Chart v-if="renderChart" class="w-3/5" />
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
