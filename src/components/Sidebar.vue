<script setup lang="ts">
import Search from './Search.vue'
import Selection from './Selection.vue'
import Options from './Options.vue'
</script>

<template>
	<Selection>
		a section for for selecting your chart, creating new, renaming, and deleting
		https://i.gyazo.com/b0bbce58dbc30fa673ed26d14e93b7ef.png
	</Selection>
	<Options>
		a section for options for the chart
		https://i.gyazo.com/e0ee4ecc4ea7b575b7a7d5b97cf9af41.png
	</Options>
	<Search>
		a search section with selection for searching for artist or for album title
		(this will likely change a ton)
	</Search>
	<div>info section maybe?</div>
</template>

<style scoped>
/*  */
</style>
