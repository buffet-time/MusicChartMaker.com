<script setup lang="ts">
import { version } from '#root/package.json'

import Dialog from '#core/Dialog.vue'
import Tooltip from '#core/Tooltip.vue'
import { onMounted, ref } from 'vue'
import SidebarButton from '#core/SidebarButton.vue'

const dialogId = 'siteInfoModal'
const changelog = ref<string>()

function showModal() {
	const modal = document.getElementById(dialogId) as HTMLDialogElement
	modal.showModal()
}

onMounted(async () => {
	const response = await (
		await fetch(
			'https://raw.githubusercontent.com/buffet-time/MusicChartMaker.com/main/CHANGELOG.md',
		)
	).text()

	const { marked } = await import('marked')
	changelog.value = await marked(response)
})
</script>

<template>
	<div class="flex items-center gap-2 justify-center">
		<SidebarButton
			:button-icon="'OpenNewWindow'"
			:button-text="'Site Info'"
			@click-handler="showModal()"
		/>

		<Dialog :dialog-id="dialogId" :close-button="true">
			<template #content>
				<div class="max-w-lg">
					<div class="flex flex-col gap-1">
						<h2 class="text-neutral-200 m-0">Site Version: {{ version }}</h2>

						<ul class="gap-1 flex flex-col text-align-left">
							<li>This site is fully open source, see the github link</li>
							<li>Not a single line of text or code written with AI ❤️</li>
							<li>This site will NEVER have Ads or any form of tracking</li>
							<li>
								Thank you to
								<a class="color-[#00FF00]" href="https://iconoir.com/"
									>Iconoir</a
								>
								for the wonderful Free to use SVG Icons ❤️
							</li>
							<li>
								This site uses a lot of newer web features, if you have a
								problem first make sure your browser is updated please!
							</li>
							<li>
								Please report any found bugs, suggestions, feedback, etc to the
								Discord!
							</li>
						</ul>
						<div
							class="text-align-left global-select overflow-overlay h-md"
							v-html="changelog"
						/>
					</div>

					<!-- Links -->
					<div class="uno-flex-center mt-4 gap-4">
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
				</div>
			</template>
		</Dialog>
	</div>
</template>

<style>
h1 {
	text-align: center;
}
</style>
