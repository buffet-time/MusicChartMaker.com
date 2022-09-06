<script setup lang="ts">
import { version } from '#root/package.json'
import Dialog from '#core/Dialog.vue'

const dialogId = 'siteInfoModal'

function showModal() {
	// prettier-ignore
	(document.getElementById(dialogId) as HTMLDialogElement).showModal()
}
</script>

<template>
	<div>
		<button type="button" class="tw-button py-1 px-3" @click="showModal()">
			Site Info
		</button>

		<Dialog :dialog-id="dialogId" :close-button="true">
			<!-- Header -->
			<p class="text-neutral-200">Site Beta-{{ version }}</p>

			<p>This site will NEVER have Ads or any form of tracking</p>
			<p>
				Discord is the preferred platform for discussion and bug reports of the
				site.
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
			<div class="pb-2">
				<h2 class="font-bold">Planned Features/ Enhancements</h2>
				<ol class="list-disc list-inside pt-1">
					<li>Support for Mobile</li>
					<li>Improve site UI/UX responsiveness</li>
					<li>Add a section in this box for explaining features of the site</li>
					<li>Fix the jankiness of renaming the artist/ album title</li>
					<li>Text: Font, Size, and Spacing options</li>
					<li>Add ability to adjust padding in chart</li>
					<li>Add ability to create custom presets</li>
					<li>
						Enhance Dialogs by making them a custom component to reduce code
						duplication
					</li>
				</ol>
			</div>
		</Dialog>
	</div>
</template>
