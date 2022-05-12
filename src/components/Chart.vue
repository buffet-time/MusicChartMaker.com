<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { ChartTileBase } from '../types'

const chartCollage = ref() as Ref<ChartTileBase[][]>
const chartWidth = ref(5)
const chartHeight = ref(2)
</script>

<template>
	<div>
		<div>the section for just the images</div>
		<div>
			and the album title section would be great to be able to edit the names
			here given how annoying seeing (remaster, explicit, etc can be)
		</div>
	</div>

	<!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
</template>

<style scoped>
/*  */
</style>
