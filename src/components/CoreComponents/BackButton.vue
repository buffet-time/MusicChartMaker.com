<script setup lang="ts">
const emit = defineEmits(['clickHandler'])
const { origin } = defineProps<{
	origin: 'Modal' | 'Overlay'
}>()
</script>

<template>
	<button
		:class="
			origin === 'Modal'
				? 'uno-button uno-close-button h-[33px] w-[33px] p-[3px]'
				: 'uno-button top-1 h-[33px] w-[33px] p-[3px]'
		"
		@click="emit('clickHandler')"
		aria-label="Back Button"
	>
		<img
			alt="Back Button"
			src="/back.svg"
			width="25"
			height="25"
			:class="origin === 'Modal' ? 'pr-[1px]' : 'cursor-pointer'"
			loading="lazy"
		/>
	</button>
</template>
