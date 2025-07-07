<script setup lang="ts">
import { ref } from 'vue'
import { GlobalSiteOptions } from '#utils/globals'
import type { OrderOptions } from '#types'

import DevTools from './SiteOptionsComponents/DevTools.vue'
import BackButton from '../CoreComponents/BackButton.vue'
import SidebarButton from '../CoreComponents/SidebarButton.vue'

const showChartOptions = ref(false)
const sectionName = 'Site Options'

const orderOptions: OrderOptions[] = [
	'Ascending',
	'Descending',
	'Most Characters',
	'Least Characters',
]

const selectedOrder = ref<OrderOptions>(
	GlobalSiteOptions.value.chartTitleSortingMethod
		? GlobalSiteOptions.value.chartTitleSortingMethod
		: 'Ascending',
)
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
			class="uno-options-overlay-div uno-sidebar-width p-0"
		>
			<div class="px-2 flex flex-col">
				<div class="flex flex-row mt-2 items-center">
					<BackButton
						:origin="'Overlay'"
						@click-handler="showChartOptions = false"
					/>

					<p class="ml-4 text-size-xl">{{ sectionName }}</p>
				</div>

				<div class="uno-options-div mt-3">
					<label for="searchResultsAmount" class="mt-8">
						# of Search Results: {{ GlobalSiteOptions?.numberOfSearchResults }}
					</label>
					<input
						id="searchResultsAmount"
						v-model="GlobalSiteOptions!.numberOfSearchResults"
						class="cursor-pointer"
						type="range"
						min="10"
						max="50"
						step="1"
					/>
				</div>

				<div class="uno-options-div">
					<label for="selectedOrder">Chart Selection Order</label>
					<select
						id="selectedOrder"
						v-model="selectedOrder"
						class="uno-input global-select uno-select pl-1 mt-2"
						@change="
							() => (GlobalSiteOptions.chartTitleSortingMethod = selectedOrder)
						"
					>
						<option v-for="(order, index) in orderOptions" :key="index">
							{{ order }}
						</option>
					</select>
				</div>

				<div class="uno-options-div">
					<label for="hideToolTips">Hide search tooltip</label>
					<input
						id="hideToolTips"
						v-model="GlobalSiteOptions.hideTooltip"
						type="checkbox"
						class="uno-checkbox cursor-pointer"
					/>
				</div>

				<DevTools />
			</div>
		</div>
	</div>
</template>
