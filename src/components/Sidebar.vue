<script setup lang="ts">
import Search from './SidebarComponents/Search.vue'
import Selection from './SidebarComponents/Selection.vue'
import Options from './SidebarComponents/Options.vue'
</script>

<template>
	<div class="flex-col">
		<Selection />
		<Options />
		<Search />
		<div>info section maybe?</div>
	</div>
</template>
