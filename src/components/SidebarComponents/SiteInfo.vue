<script setup lang="ts">
import { version } from '#root/package.json'

import Dialog from '#core/Dialog.vue'
import Tooltip from '#core/Tooltip.vue'

const dialogId = 'siteInfoModal'

function showModal() {
	const modal = document.getElementById(dialogId) as HTMLDialogElement
	modal.showModal()
}
</script>

<template>
	<div class="tw-flex-center gap-2">
		<button
			type="button"
			class="tw-button flex w-7/12 items-center gap-2"
			@click="showModal()"
		>
			<img
				title="open in browser"
				alt="open in browser"
				src="/openInBrowser.svg"
				width="25"
				height="25"
				class="cursor-pointer bg-neutral-500"
				loading="lazy"
			/>
			<label class="cursor-pointer pb-[2px]"> Site Info </label>
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
				<div class="tw-flex-center mt-2 gap-4">
					<Tooltip
						:tooltip-name="`discord-logo`"
						:offset="[0, 0]"
						:delay="250"
						:placement="'bottom'"
					>
						<template #content>
							<a
								class="py-1"
								href="https://discord.gg/526et4zxBT"
								target="_blank"
							>
								<img src="/discord.png" alt="Discord Logo" loading="lazy" />
							</a>
						</template>

						<template #tooltip>
							This sites discord, ask questions report bugs.
						</template>
					</Tooltip>

					<Tooltip
						:tooltip-name="`github-logo`"
						:offset="[0, 0]"
						:delay="250"
						:placement="'bottom'"
					>
						<template #content>
							<a
								class="py-1"
								href="https://github.com/buffet-time/MusicChartMaker.com"
								target="_blank"
							>
								<img src="/github.png" alt="Github Logo" loading="lazy" />
							</a>
						</template>

						<template #tooltip> The source code to this site. </template>
					</Tooltip>
				</div>
			</template>
		</Dialog>
	</div>
</template>
