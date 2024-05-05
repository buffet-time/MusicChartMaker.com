<script setup lang="ts">
import { ref } from 'vue'
import { GenerateDefaultChart } from '#shared/chart'
import { GlobalChartState, GlobalSiteOptions } from '#shared/globals'

import Dialog from '#core/Dialog.vue'
import Background from './ChartOptionsComponents/Background.vue'
import ChartSize from './ChartOptionsComponents/ChartSize.vue'
import TextOptions from './ChartOptionsComponents/TextOptions.vue'
import Font from './ChartOptionsComponents/Font.vue'
import { GenerateDefaultSiteOptions } from '#shared/misc'

const resetOptionsId = 'resetoptions'

const showChartOptions = ref(false)

function openResetOptionsModal() {
	const resetOptionsModal = document.getElementById(
		resetOptionsId
	) as HTMLDialogElement
	resetOptionsModal.showModal()
}

function closeResetOptionModal() {
	const resetOptionsModal = document.getElementById(
		resetOptionsId
	) as HTMLDialogElement
	resetOptionsModal.close()
}

function resetOptionsToDefault() {
	const defaultChartOptions = GenerateDefaultChart().options
	const defaultSearchResults =
		GenerateDefaultSiteOptions().numberOfSearchResults

	GlobalChartState.value.options = {
		chartSize: GlobalChartState.value.options.chartSize,
		chartTitle: GlobalChartState.value.options.chartTitle,
		preset: GlobalChartState.value.options.preset,
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
		padding: 0.2,
		lockChart: false
	}

	GlobalSiteOptions.value = {
		currentChart: GlobalSiteOptions.value.currentChart,
		numberOfSearchResults: defaultSearchResults
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
				class="tw-button flex w-10/12 items-center gap-2"
				@click="showChartOptions = true"
			>
				<img
					title="Open in window icon"
					alt="open in window icon"
					src="/openInWindow.svg"
					width="25"
					height="25"
					class="cursor-pointer bg-neutral-500"
					loading="lazy"
				/>
				<label class="cursor-pointer pb-[2px]"> Chart Options </label>
			</button>
		</div>

		<!-- The options overlay -->
		<div v-if="showChartOptions" class="tw-options-overlay-div">
			<img
				title="Close Options"
				alt="close-button"
				src="/back.svg"
				width="25"
				height="25"
				class="absolute left-0 m-[6px] mt-[6px] cursor-pointer bg-neutral-500"
				loading="lazy"
				@click="showChartOptions = false"
			/>
			<template v-if="!GlobalChartState.options.lockChart">
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
							<p class="text-neutral-200">
								Reset all options to their defaults?
							</p>

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
			</template>

			<!-- Lock chart check -->
			<div class="tw-options-div">
				<label>Lock this chart?</label>
				<input
					v-model="GlobalChartState!.options.lockChart"
					class="tw-checkbox"
					type="checkbox"
				/>
			</div>
		</div>
	</div>
</template>
