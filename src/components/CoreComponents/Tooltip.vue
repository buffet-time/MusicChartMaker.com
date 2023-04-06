<script setup lang="ts">
import { createPopper, type Placement, type Instance } from '@popperjs/core'
import { Ref, onMounted, ref } from 'vue'

const props = defineProps<{
	tooltipName: string
	offset: [number, number] // [Y, X]
	delay: number
	placement: Placement
}>()

const contentSlot = ref() as Ref<HTMLDivElement>
const tooltipSlot = ref() as Ref<HTMLDivElement>
let popperInstance: Instance

onMounted(() => {
	popperInstance = createPopper(contentSlot.value, tooltipSlot.value, {
		placement: props.placement,
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: props.offset
				}
			}
		]
	})
})

let timer: ReturnType<typeof setTimeout>

function onStart() {
	timer = setTimeout(openTooltip, props.delay)
}

function openTooltip() {
	tooltipSlot.value?.setAttribute('data-show', '')
	popperInstance.update()
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
		class="tooltip z-10 rounded-md bg-[#505050] px-2 py-1"
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
