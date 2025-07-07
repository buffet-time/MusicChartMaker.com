<script setup lang="ts">
import { ref } from 'vue'
import { GenerateDefaultChart } from '#utils/chart'
import { GlobalChartState, GlobalSiteOptions } from '#utils/globals'

import Dialog from '#core/Dialog.vue'
import Background from './ChartOptionsComponents/Background.vue'
import ChartSize from './ChartOptionsComponents/ChartSize.vue'
import TextOptions from './ChartOptionsComponents/TextOptions.vue'
import Font from './ChartOptionsComponents/Font.vue'
import { GenerateDefaultSiteOptions } from '#utils/misc'
import TextShadow from './ChartOptionsComponents/TextShadow.vue'
import BackButton from '#core/BackButton.vue'
import SidebarButton from '#core/SidebarButton.vue'

const resetOptionsId = 'resetoptions'
const sectionName = 'Chart Options'

const showChartOptions = ref(false)

function openResetOptionsModal() {
	const resetOptionsModal = document.getElementById(
		resetOptionsId,
	) as HTMLDialogElement
	resetOptionsModal.showModal()
}

function closeResetOptionModal() {
	const resetOptionsModal = document.getElementById(
		resetOptionsId,
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
		textShadow: defaultChartOptions.textShadow,
		fontSize: defaultChartOptions.fontSize,
		textSpacing: defaultChartOptions.textSpacing,
		font: defaultChartOptions.font,
		backgroundImage: undefined,
		padding: 0.2,
		lockChart: false,
	}

	GlobalSiteOptions.value = {
		currentChart: GlobalSiteOptions.value.currentChart,
		numberOfSearchResults: defaultSearchResults,
	}
	closeResetOptionModal()
}
</script>

<template>
	<div>
		<div class="uno-flex-center gap-2">
			<SidebarButton
				:button-icon="'OpenInWindow'"
				:button-text="sectionName"
				@click-handler="showChartOptions = true"
			/>
		</div>

		<!-- The options overlay -->
		<div
			v-if="showChartOptions"
			class="uno-sidebar-width uno-options-overlay-div px-0"
		>
			<div class="flex flex-col px-2">
				<div class="flex flex-row mt-2 items-center">
					<BackButton
						:origin="'Overlay'"
						@click-handler="showChartOptions = false"
					/>
					<p class="ml-4 text-size-xl">{{ sectionName }}</p>
				</div>

				<template v-if="!GlobalChartState.options.lockChart">
					<ChartSize />

					<div class="mt-4">
						<Font />
					</div>

					<div>
						<TextOptions />
					</div>

					<TextShadow />

					<Background />

					<div class="pt-2">
						<button class="uno-button" @click="openResetOptionsModal">
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
									<button class="uno-button" @click="resetOptionsToDefault">
										Yes
									</button>
									<button class="uno-button" @click="closeResetOptionModal">
										No
									</button>
								</div>
							</template>
						</Dialog>
					</div>
				</template>

				<!-- Lock chart check -->
				<div class="uno-options-div">
					<label for="lockChart">Lock this chart?</label>
					<input
						id="lockChart"
						v-model="GlobalChartState!.options.lockChart"
						class="uno-checkbox"
						type="checkbox"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
