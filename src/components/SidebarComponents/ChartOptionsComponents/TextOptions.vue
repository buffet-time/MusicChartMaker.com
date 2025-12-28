<script setup lang="ts">
import { GlobalChartState } from '#utils/globals'
import Tooltip from '../../CoreComponents/Tooltip.vue'
</script>

<template>
	<div class="uno-options-div">
		<label for="displayTitles">Show Album Titles</label>
		<input
			id="displayTitles"
			v-model="GlobalChartState!.options.displayTitles"
			type="checkbox"
			class="uno-checkbox cursor-pointer"
		/>
	</div>

	<Tooltip
		:tooltip-name="`font-selector`"
		:offset="[0, 0]"
		:delay="250"
		:placement="'right'"
	>
		<template #content>
			<div class="uno-options-div">
				<label for="constrainTitles">Constrain titles to rows</label>
				<input
					id="constrainTitles"
					v-model="GlobalChartState!.options.constrainTitles"
					type="checkbox"
					class="uno-checkbox border-none"
					:class="{
						'cursor-pointer':
							GlobalChartState.options.displayTitles &&
							!GlobalChartState.options.preset,
					}"
					:disabled="
						!GlobalChartState.options.displayTitles ||
						GlobalChartState.options.preset
					"
				/>
			</div>
		</template>

		<template #tooltip>
			Allows the titles to render alongside the given row <br />
			Not available when using a preset<br />
			This is <b>not</b> recommended for mobile.
		</template>
	</Tooltip>

	<div v-if="GlobalChartState!.options.constrainTitles" class="uno-options-div">
		<label for="constrainTitlesCentered">Center constrained titles</label>
		<input
			id="constrainTitlesCentered"
			v-model="GlobalChartState!.options.constrainTitlesCentered"
			type="checkbox"
			class="uno-checkbox border-none"
			:class="{
				'cursor-pointer':
					GlobalChartState.options.displayTitles &&
					!GlobalChartState.options.preset,
			}"
			:disabled="
				!GlobalChartState.options.displayTitles ||
				GlobalChartState.options.preset
			"
		/>
	</div>

	<div class="uno-options-div">
		<label for="displayNumberRank">Show Numbers</label>
		<input
			id="displayNumberRank"
			v-model="GlobalChartState!.options.displayNumberRank"
			type="checkbox"
			class="uno-checkbox cursor-pointer border-none"
			:disabled="!GlobalChartState?.options.displayTitles"
		/>
	</div>

	<div class="uno-options-div">
		<label for="textColor">Text Color</label>
		<input
			id="textColor"
			v-model="GlobalChartState!.options.textColor"
			type="color"
			class="cursor-pointer bg-transparent border-none"
			:disabled="!GlobalChartState?.options.displayTitles"
		/>
	</div>
</template>
