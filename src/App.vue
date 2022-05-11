<script setup lang="ts">
import Chart from './components/Chart.vue'
import Sidebar from './components/Sidebar.vue'

// Data will be handled here and handed down as props to chart
</script>

<template>
	<h1 class="tw-h1 pb-4">blah</h1>
	<Sidebar />
	<Chart />
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
