<script setup lang="ts">
import { ref } from 'vue'
import Close from '#assets/whiteClose.svg'

import DevTools from './OptionsComponents/DevTools.vue'
import Background from './OptionsComponents/Background.vue'
import ChartSize from './OptionsComponents/ChartSize.vue'
import TextOptions from './OptionsComponents/TextOptions.vue'

const showOptions = ref(false)
</script>

<template>
	<div>
		<!-- in the sidebar -->
		<div class="tw-flex-center gap-2">
			<button
				type="button"
				class="tw-button cursor-pointer"
				@click="showOptions = true"
			>
				Show Options
			</button>
		</div>

		<!-- The options overlay -->
		<div
			v-if="showOptions"
			class="flex flex-col tw-sidebar-width h-full z-0 top-0 left-0 fixed bg-[#404040] px-2 pb-2"
		>
			<img
				title="Close Options"
				:src="Close"
				class="cursor-pointer w-7 absolute right-0 mt-1 mr-1 bg-neutral-500 fill-white p-1"
				@click="showOptions = false"
			/>

			<ChartSize />

			<TextOptions />

			<Background />

			<div class="pt-2">
				<DevTools />
			</div>
		</div>
	</div>
</template>
