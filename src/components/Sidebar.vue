<script setup lang="ts">
import Search from './SidebarComponents/Search.vue'
import Selection from './SidebarComponents/Selection.vue'
import Options from './SidebarComponents/Options.vue'
import { onMounted, type Ref, ref } from 'vue'
import { version } from '../../package.json'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()

const siteInfo = ref() as Ref<HTMLDialogElement>
const showOptions = ref(false)

function onCanRender() {
	emit('canRenderChart')
	showOptions.value = true
}

onMounted(async () => {
	if (typeof HTMLDialogElement !== 'function') {
		const { default: dialogPolyfill } = await import('dialog-polyfill')
		dialogPolyfill.registerDialog(siteInfo.value)
	}
})
</script>

<template>
	<div class="flex-col tw-sidebar-width fixed bg-[#303030] h-full">
		<div>
			<button
				type="button"
				class="tw-button mt-2 mb-1 py-1 px-3"
				@click="siteInfo.showModal()"
			>
				Site Info
			</button>
		</div>
		<Selection @can-render-chart="onCanRender" />
		<Options v-if="showOptions" />
		<Search />

		<dialog ref="siteInfo" class="bg-transparent">
			<div
				class="bg-neutral-700 p-5 flex flex-col gap-2 justify-center items-center text-white"
			>
				<!-- Header -->
				<p class="text-neutral-200">Site Beta-{{ version }}</p>

				<p>This site will NEVER have Ads or any form of tracking</p>
				<p>
					Disocrd is the preferred platform for discussion and bug reports of
					the site.
				</p>
				<!-- Links -->
				<div class="flex mt-1 mb-1 gap-1 justify-center">
					<a
						class="tw-button py-1"
						href="https://discord.gg/526et4zxBT"
						target="_blank"
					>
						Discord
					</a>
					<a
						class="tw-button py-1"
						href="https://github.com/buffet-time/MusicChartMaker.com"
						target="_blank"
					>
						GitHub
					</a>
					<a
						title="Helps pay for server and domain cost / childcare"
						class="tw-button py-1"
						href="https://www.paypal.com/paypalme/BuffetTime"
						target="_blank"
					>
						Donate
					</a>
				</div>

				<!-- Text info -->

				<!-- the main things i need to add:
					TODO:
					1) add a modal for tips on less obvious functionality
					2) Fix clicking anywhere below the titles triggereing content editable
					3) text font/ size change options
					4) Padding 
					5) improve editing of artist and album name to maybe be editable all at once?
					6) Allow for saving as JPEG, GIF, WebM -- https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL 
					7) look more into the vite vue plugin - i think this is regarding performance (slightly younger me being a bit obtuse)

					A) options to set how many albums in a row
						1) have some sort of ui to create these yourself
				-->
				<div class="pb-2">
					<h2 class="font-bold">Planned Features/ Enhancements</h2>
					<ol class="list-disc list-inside pt-1">
						<li>Support for Mobile</li>
						<li>
							Add a section in this box for explaining features of the site
						</li>
						<li>Fix the jankiness of renaming the artist/ album title</li>
						<li>Text: Font, Size, and Spacing options</li>
						<li>Add ability to adjust padding in chart</li>
						<li>Allow for saving the chart as JPG, GIF, WebP, WebM, etc</li>
						<li>Close modals on click away</li>
					</ol>
				</div>

				<!-- Footer -->
				<div class="flex gap-2">
					<button class="tw-button" @click="siteInfo.close()">Close</button>
				</div>
			</div>
		</dialog>
	</div>
</template>
