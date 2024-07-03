<script setup lang="ts">
import { createPopper, type Placement, type Instance } from '@popperjs/core'
import { Ref, onMounted, ref } from 'vue'

// TODO: add conditional to create this with native HTML popover
// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover

const { tooltipName, offset, delay, placement } = defineProps<{
	tooltipName: string
	offset: [number, number] // [Y, X]
	delay: number
	placement: Placement
}>()

const contentSlot = ref() as Ref<HTMLDivElement>
const tooltipSlot = ref() as Ref<HTMLDivElement>
let popperInstance: Instance
let timer: ReturnType<typeof setTimeout>

onMounted(() => {
	popperInstance = createPopper(contentSlot.value, tooltipSlot.value, {
		placement: placement,
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: offset
				}
			}
		]
	})
})

function onStart() {
	timer = setTimeout(openTooltip, delay)
}

function openTooltip() {
	tooltipSlot.value?.setAttribute('data-show', '')
	void popperInstance.update()
}

function onEnd() {
	clearTimeout(timer)
	tooltipSlot.value?.removeAttribute('data-show')
}
</script>

<template>
	<div
		ref="contentSlot"
		:aria-describedby="tooltipName"
		@mouseenter="onStart"
		@focus="onStart"
		@dragstart="onEnd"
		@mouseleave="onEnd"
		@blur="onEnd"
	>
		<slot name="content"></slot>
	</div>

	<div
		:id="tooltipName"
		ref="tooltipSlot"
		class="z-10 px-2 tooltip rounded-md bg-[#505050] py-1"
		role="tooltip"
	>
		<slot name="tooltip"></slot>
		<div id="arrow" data-popper-arrow></div>
	</div>
</template>

<style>
.tooltip {
	display: none;
}
.tooltip[data-show] {
	display: block;
}

#arrow,
#arrow::before {
	position: absolute;
	width: 8px;
	height: 8px;
	background: inherit;
}

#arrow {
	visibility: hidden;
}

#arrow::before {
	visibility: visible;
	content: '';
	transform: rotate(45deg);
}

.tooltip[data-popper-placement^='top'] > #arrow {
	bottom: -4px;
}

.tooltip[data-popper-placement^='bottom'] > #arrow {
	top: -4px;
}

.tooltip[data-popper-placement^='left'] > #arrow {
	right: -4px;
}

.tooltip[data-popper-placement^='right'] > #arrow {
	left: -4px;
}
</style>
