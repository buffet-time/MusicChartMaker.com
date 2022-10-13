<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import { ref } from 'vue'
import { GenerateDefaultChart } from '#shared/chart'
import { GlobalChartState, GlobalSiteOptions } from '#shared/globals'

import Back from '#assets/back.svg'
import Dialog from '#core/Dialog.vue'
import DevTools from './OptionsComponents/DevTools.vue'
import Background from './OptionsComponents/Background.vue'
import ChartSize from './OptionsComponents/ChartSize.vue'
import TextOptions from './OptionsComponents/TextOptions.vue'
import Font from './OptionsComponents/Font.vue'
import { GenerateDefaultSiteOptions } from '#shared/misc'

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
	const defaultChartOptions = GenerateDefaultChart().options
	const defaultSearchResults =
		GenerateDefaultSiteOptions().numberOfSearchResults

	GlobalChartState.options = {
		chartSize: GlobalChartState.options.chartSize,
		chartTitle: GlobalChartState.options.chartTitle,
		preset: GlobalChartState.options.preset,
		displayNumberRank: defaultChartOptions.displayNumberRank,
		displayTitles: defaultChartOptions.displayTitles,
		displayPlaycount: defaultChartOptions.displayPlaycount,
		background: defaultChartOptions.background,
		textColor: defaultChartOptions.textColor,
		textBorderColor: defaultChartOptions.textBorderColor,
		fontSize: defaultChartOptions.fontSize,
		textSpacing: defaultChartOptions.textSpacing,
		font: defaultChartOptions.font,
		backgroundImage: undefined,
		padding: 0.2
	}

	Object.assign(GlobalSiteOptions, {
		currentChart: GlobalSiteOptions.currentChart,
		numberOfSearchResults: defaultSearchResults
	})
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
			class="flex flex-col overflow-auto tw-sidebar-width h-full z-0 top-0 left-0 fixed bg-[#404040] px-2 pb-2"
		>
			<img
				title="Close Options"
				alt="close-button"
				:src="Back"
				width="25"
				height="25"
				class="cursor-pointer absolute left-0 mt-[6px] m-[6px] bg-neutral-500"
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
					<template #content>
						<p class="text-neutral-200">
							This will not reset Chart Size or any albums that are in the
							chart.
						</p>
						<p class="text-neutral-200">Reset all options to their defaults?</p>

						<div class="flex gap-2">
							<button class="tw-button" @click="resetOptionsToDefault">
								Yes
							</button>
							<button class="tw-button" @click="closeResetOptionModal">
								No
							</button>
						</div>
					</template>
				</Dialog>
			</div>

			<div class="pt-2">
				<DevTools />
			</div>
		</div>
	</div>
</template>
