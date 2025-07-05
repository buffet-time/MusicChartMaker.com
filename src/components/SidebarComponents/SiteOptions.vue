<script setup lang="ts">
import { ref } from 'vue'
import { GlobalSiteOptions } from '#utils/globals'
import type { OrderOptions } from '#types'

import DevTools from './SiteOptionsComponents/DevTools.vue'

const showChartOptions = ref(false)

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

<!-- TODO: add site level styling options for users -->
<template>
	<div>
		<!-- in the sidebar -->
		<div class="uno-flex-center gap-2">
			<button
				type="button"
				class="uno-button flex w-10/12 items-center gap-2"
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
				<label class="cursor-pointer pb-[2px]"> Site Options </label>
			</button>
		</div>

		<!-- The options overlay -->
		<div
			v-if="showChartOptions"
			class="uno-options-overlay-div uno-sidebar-width p-0"
		>
			<div class="px-2 flex flex-col">
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

				<div class="uno-options-div mt-10">
					<label class="mt-8">
						# of Search Results: {{ GlobalSiteOptions?.numberOfSearchResults }}
					</label>
					<input
						v-model="GlobalSiteOptions!.numberOfSearchResults"
						class="cursor-pointer"
						type="range"
						min="10"
						max="50"
						step="1"
					/>
				</div>

				<div class="uno-options-div">
					<p class="mb-2">Chart Selection Order</p>
					<select
						v-model="selectedOrder"
						class="uno-input global-select uno-select pl-1"
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
					<label>Hide search tooltip</label>
					<input
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
