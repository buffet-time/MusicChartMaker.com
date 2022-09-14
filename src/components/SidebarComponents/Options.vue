<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import { ref } from 'vue'
import Close from '#assets/whiteClose.svg'
import {
	GenerateDefaultChart,
	GlobalChartState,
	GlobalSiteOptions
} from '#root/src/shared'

import Dialog from '#core/Dialog.vue'
import DevTools from './OptionsComponents/DevTools.vue'
import Background from './OptionsComponents/Background.vue'
import ChartSize from './OptionsComponents/ChartSize.vue'
import TextOptions from './OptionsComponents/TextOptions.vue'
import Font from './OptionsComponents/Font.vue'

const resetOptionsId = 'resetoptions'

const showOptions = ref(false)

function openResetOptionsModal() {
	// prettier-ignore
	(document.getElementById(resetOptionsId) as HTMLDialogElement).showModal()
}

function closeResetOptionModal() {
	// prettier-ignore
	(document.getElementById(resetOptionsId) as HTMLDialogElement).close()
}

function resetOptionsToDefault() {
	const defaultOptions = GenerateDefaultChart().options

	GlobalChartState.value!.options = {
		chartSize: GlobalChartState.value!.options.chartSize,
		chartTitle: GlobalChartState.value!.options.chartTitle,
		preset: GlobalChartState.value!.options.preset,
		displayNumberRank: defaultOptions.displayNumberRank,
		displayTitles: defaultOptions.displayTitles,
		displayPlaycount: defaultOptions.displayPlaycount,
		background: defaultOptions.background,
		textColor: defaultOptions.textColor,
		textBorderColor: defaultOptions.textBorderColor,
		fontSize: defaultOptions.fontSize,
		textSpacing: defaultOptions.textSpacing,
		font: defaultOptions.font,
		backgroundImage: undefined,
		padding: 0.2
	}

	GlobalSiteOptions.value! = {
		currentChart: GlobalSiteOptions.value!.currentChart,
		numberOfSearchResults: 10
	}

	closeResetOptionModal()
}
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

			<div class="mt-4">
				<Font />
			</div>

			<div>
				<TextOptions />
			</div>

			<Background />

			<div class="pt-2">
				<button class="tw-button" @click="openResetOptionsModal">
					Reset to Default
				</button>

				<Dialog :dialog-id="resetOptionsId" :close-button="true">
					<p class="text-neutral-200">
						This will not reset Chart Size or any albums that are in the chart.
					</p>
					<p class="text-neutral-200">Reset all options to their defaults?</p>

					<div class="flex gap-2">
						<button class="tw-button" @click="resetOptionsToDefault">
							Yes
						</button>
						<button class="tw-button" @click="closeResetOptionModal">No</button>
					</div>
				</Dialog>
			</div>

			<div class="pt-2">
				<DevTools />
			</div>
		</div>
	</div>
</template>
