<script setup lang="ts">
import { version } from '#root/package.json'

import Dialog from '#core/Dialog.vue'

const dialogId = 'siteInfoModal'

function showModal() {
	const modal = document.getElementById(dialogId) as HTMLDialogElement
	modal.showModal()
}
</script>

<template>
	<div>
		<button type="button" class="tw-button" @click="showModal()">
			Site Info
		</button>

		<Dialog :dialog-id="dialogId" :close-button="true">
			<template #content>
				<!-- Header -->
				<p class="text-neutral-200">Site Version: {{ version }}</p>

				<p>This site is fully open source, see the github link</p>
				<p>This site will NEVER have Ads or any form of tracking</p>
				<p>
					This site uses a lot of newer web features, please use the latest
					version of your browser!
				</p>

				<!-- Links -->
				<div class="tw-flex-center mb-1 mt-1 gap-1">
					<a
						class="tw-button py-1"
						href="https://discord.gg/526et4zxBT"
						target="_blank"
					>
						<img src="/discord.png" alt="Discord Logo" loading="lazy" />
					</a>

					<a
						class="tw-button py-1"
						href="https://github.com/buffet-time/MusicChartMaker.com"
						target="_blank"
					>
						<img src="/github.png" alt="Github Logo" loading="lazy" />
					</a>
				</div>
			</template>
		</Dialog>
	</div>
</template>
