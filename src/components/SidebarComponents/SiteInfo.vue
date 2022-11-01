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
			<template #content>
				<!-- Header -->
				<p class="text-neutral-200">Site Beta-{{ version }}</p>

				<p>This site will NEVER have Ads or any form of tracking</p>
				<p>
					Discord is the preferred platform for discussion and bug reports of
					the site.
				</p>
				<p>
					This site uses a lot of newer web features, please use the latest
					version of your browser!
				</p>

				<!-- Links -->
				<div class="tw-flex-center mt-1 mb-1 gap-1">
					<a
						class="tw-button py-1"
						href="https://discord.gg/526et4zxBT"
						target="_blank"
					>
						<img src="../../assets/discord.png" alt="Discord Logo" />
					</a>

					<a
						class="tw-button py-1"
						href="https://github.com/buffet-time/MusicChartMaker.com"
						target="_blank"
					>
						<img src="../../assets/github.png" alt="Github Logo" />
					</a>

					<a
						class="tw-button py-1"
						href="https://www.paypal.com/paypalme/BuffetTime"
						target="_blank"
					>
						<img src="../../assets/paypal.png" alt="Paypal Logo" />
					</a>
				</div>

				<!-- Text info -->
				<div class="pb-2">
					<h2 class="font-bold">Planned Features/ Enhancements</h2>
					<ol class="list-disc list-inside pt-1">
						<li>
							RYM functionality (dependent on if their API is free/ works)
						</li>
						<li>Embedding chartdata into exported images</li>
					</ol>
				</div>
			</template>
		</Dialog>
	</div>
</template>
