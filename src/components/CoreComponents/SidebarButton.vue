<script setup lang="ts">
const emit = defineEmits(['clickHandler'])
const { buttonText, buttonIcon } = defineProps<{
	buttonText: string
	buttonIcon: 'Download' | 'OpenInWindow' | 'OpenNewWindow'
}>()
</script>

<template>
	<button
		type="button"
		class="uno-button flex w-10/12 items-center gap-2"
		@click="emit('clickHandler')"
	>
		<img
			:title="
				buttonIcon === 'Download'
					? 'Download icon'
					: buttonIcon === 'OpenInWindow'
						? 'Open in Window Icon'
						: 'Open in New Window Icon'
			"
			:alt="
				buttonIcon === 'Download'
					? 'Download icon'
					: buttonIcon === 'OpenInWindow'
						? 'Open in Window Icon'
						: 'Open in New Window Icon'
			"
			:src="
				buttonIcon === 'Download'
					? '/download.svg'
					: buttonIcon === 'OpenInWindow'
						? '/openInWindow.svg'
						: '/openNewWindow.svg'
			"
			width="25"
			height="25"
			class="cursor-pointer bg-neutral-500"
			loading="lazy"
		/>
		<label class="cursor-pointer pb-[2px]"> {{ buttonText }} </label>
	</button>
</template>
