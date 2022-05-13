<script setup lang="ts">
import Chart from './components/Chart.vue'
import Sidebar from './components/Sidebar.vue'

// Data will be handled here and handed down as props to chart

// https://musicsheet.danielturcich.com/Search?album=bleed
</script>

<template>
	<div class="flex">
		<Sidebar class="w-2/5" />
		<Chart class="w-3/5" />
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
