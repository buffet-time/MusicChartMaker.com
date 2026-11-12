<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type {
	AlbumSearchResult,
	MovieAndTvSearchResult,
	SearchResult,
	SearchResults,
	Tabs,
} from '#types'
import { GlobalChartState, GlobalSiteOptions } from '#utils/globals'
import { onDragStart, onTouchStart } from '#utils/drag'
import {
	GrayBoxImgFromApiForMusic,
	GrayBoxImgFromApiForMedia,
	GrayBoxImgForPlaceholderForMusic,
	GrayBoxImgForPlaceholderForMedia,
	IsImage,
	isMobile,
	LegacyPlaceholder,
} from '#utils/misc'

import Tooltip from '#core/Tooltip.vue'
import SearchInput from './SearchInput.vue'
import { searchAlbum } from '#lastfm/main'
import { searchMovie, searchTV } from '#tmdb/main'
import SearchProviderAttribution from './SearchProviderAttribution.vue'
import { getMediaNameWithoutNumber } from '#root/src/utils/chart'
import { watchDeep } from '@vueuse/core'

let previousSearch = ''
const searchResults = ref<SearchResults>()
const showSearchResults = ref(false)
const activeTab = ref<Tabs>('Music')
const currentTabs = ref<Tabs[]>([])

const allTabs: Tabs[] = ['Music', 'Movies', 'TV']

// oxlint-disable-next-line unicorn/prefer-set-has
const PLACEHOLDERS = [
	GrayBoxImgFromApiForMusic,
	GrayBoxImgFromApiForMedia,
	GrayBoxImgForPlaceholderForMusic,
	GrayBoxImgForPlaceholderForMedia,
	LegacyPlaceholder,
]

watch(activeTab, () => {
	previousSearch = ''
	showSearchResults.value = false
	searchResults.value = undefined
})

watchDeep(
	() => GlobalChartState.value.chartTiles,
	// oxlint-disable-next-line no-use-before-define
	() => setWhichTabsAreAvailable(),
)

watch(
	() => GlobalSiteOptions.value.currentChart,
	() => setWhichTabsAreAvailable(),
)

onMounted(() => setWhichTabsAreAvailable())

// remove the boolean, and fix this not updating properly.
function setWhichTabsAreAvailable() {
	for (let x = 0; x < GlobalChartState.value.chartTiles.length; x++) {
		for (let y = 0; y < GlobalChartState.value.chartTiles[x].length; y++) {
			if (
				!PLACEHOLDERS.includes(GlobalChartState.value.chartTiles[x][y].image)
			) {
				// @ts-expect-error - this is to change what this value did, it used top be 'album' | 'media'
				if (GlobalChartState.value.options.mediaType === 'album') {
					GlobalChartState.value.options.mediaType = 'Music'
					activeTab.value = 'Music'
					currentTabs.value = ['Music']
					return
				}

				// @ts-expect-error - this is to change what this value did, it used top be 'album' | 'media'
				if (GlobalChartState.value.options.mediaType === 'media') {
					GlobalChartState.value.options.mediaType = 'Movies'
					activeTab.value = 'Movies'
					currentTabs.value = ['Movies', 'TV']
					return
				}

				activeTab.value = GlobalChartState.value.options.mediaType ?? 'Music'
				currentTabs.value = GlobalChartState.value.options.mediaType
					? [GlobalChartState.value.options.mediaType]
					: allTabs
				return
			}
		}
	}
	currentTabs.value = allTabs
	activeTab.value = 'Music'
}

function getSearchResultsLength() {
	return searchResults.value ? searchResults.value.results.length : 0
}

function handleClick(searchResult: SearchResult) {
	GlobalChartState.value.options.mediaType = activeTab.value
	for (
		let rowIndex = 0;
		rowIndex < GlobalChartState.value.chartTiles.length;
		rowIndex += 1
	) {
		for (
			let elementIndex = 0;
			elementIndex < GlobalChartState.value.chartTiles[rowIndex].length;
			elementIndex += 1
		) {
			if (
				PLACEHOLDERS.includes(
					GlobalChartState.value.chartTiles[rowIndex][elementIndex].image,
				)
			) {
				if (searchResult.type === 'album') {
					GlobalChartState.value.chartTiles[rowIndex][elementIndex] = {
						artist: searchResult.result.artist,
						image: searchResult.result.image,
						name: searchResult.result.name,
					}
					return
				}

				GlobalChartState.value.chartTiles[rowIndex][elementIndex] = {
					title: searchResult.result.title,
					image: searchResult.result.image,
					year: searchResult.result.year,
				}
				return
			}
		}
	}
}

async function searchMusic(searchString: string) {
	showSearchResults.value = false
	if (searchString === '') {
		return
	}

	if (previousSearch === searchString) {
		showSearchResults.value = true
		return
	}

	previousSearch = searchString

	if (await IsImage(searchString)) {
		searchResults.value = {
			type: 'album',
			results: [
				{ artist: 'Artist Name', name: 'Album Name', image: searchString },
			],
		}
		showSearchResults.value = true
		return
	}

	const albumSearchResults =
		(await searchAlbum(
			GlobalSiteOptions.value.numberOfSearchResults,
			searchString,
		)) ?? []

	searchResults.value = {
		type: 'album',
		results: albumSearchResults,
	}

	if (!showSearchResults.value) {
		showSearchResults.value = true
	}
}

async function searchMovies(searchString: string) {
	showSearchResults.value = false
	if (searchString === '') {
		return
	}

	if (previousSearch === searchString) {
		showSearchResults.value = true
		return
	}

	previousSearch = searchString

	if (await IsImage(searchString)) {
		searchResults.value = {
			type: 'media',
			results: [{ title: 'TV/ Movie Name', year: '2019', image: searchString }],
		}
		showSearchResults.value = true
		return
	}

	const movieSearchResults = (await searchMovie({ term: searchString })) ?? []

	searchResults.value = {
		type: 'media',
		results: movieSearchResults,
	}

	if (!showSearchResults.value) {
		showSearchResults.value = true
	}
}

async function searchTvShows(searchString: string) {
	showSearchResults.value = false
	if (searchString === '') {
		return
	}

	if (previousSearch === searchString) {
		showSearchResults.value = true
		return
	}

	previousSearch = searchString

	if (await IsImage(searchString)) {
		searchResults.value = {
			type: 'media',
			results: [{ title: 'TV/ Movie Name', year: '2019', image: searchString }],
		}
		showSearchResults.value = true
		return
	}

	const movieSearchResults = (await searchTV({ term: searchString })) ?? []

	searchResults.value = {
		type: 'media',
		results: movieSearchResults,
	}

	if (!showSearchResults.value) {
		showSearchResults.value = true
	}
}
</script>

<template>
	<div class="flex-col h-full gap-2 mt-1 flex">
		<div class="flex w-full justify-between tab-container mb-1">
			<a
				v-for="(tabName, index) in currentTabs"
				:key="`${index}-${currentTabs.length}`"
				role="button"
				class="flex h-8 justify-center items-center bg-neutral-500 cursor-pointer"
				:class="{ 'tab-active': activeTab === tabName }"
				:style="{ width: 100 / currentTabs.length + '%' }"
				@click="() => (activeTab = tabName)"
			>
				{{ tabName }}
			</a>
		</div>

		<template v-if="activeTab === 'Music'">
			<SearchProviderAttribution search-provider="lastfm" />
			<SearchInput
				:show-search-results="showSearchResults"
				@search="(value) => searchMusic(value)"
				@update-show-search-results="(value) => (showSearchResults = value)"
			/>
		</template>

		<template v-if="activeTab === 'Movies'">
			<SearchProviderAttribution search-provider="tmdb" />
			<SearchInput
				:show-search-results="showSearchResults"
				@search="(value) => searchMovies(value)"
				@update-show-search-results="(value) => (showSearchResults = value)"
			/>
		</template>

		<template v-if="activeTab === 'TV'">
			<SearchProviderAttribution search-provider="tmdb" />
			<SearchInput
				:show-search-results="showSearchResults"
				@search="(value) => searchTvShows(value)"
				@update-show-search-results="(value) => (showSearchResults = value)"
			/>
		</template>

		<div
			v-if="showSearchResults"
			class="uno-flex-center uno-search-results-div results-div md:flex-[0.98] m-0"
			:class="{
				'items-start': getSearchResultsLength() < 1,
				'overflow-hidden': getSearchResultsLength() < 1,
				'bg-[rgb(100,100,100)]': isMobile,
				absolute: isMobile,
				'top-0': isMobile,
				'left-0': isMobile,
				'w-full': isMobile,
				'py-2': isMobile,
			}"
		>
			<ul
				class="flex flex-col gap-2 overflow-hidden pr-2 ml-[-12px]"
				v-if="getSearchResultsLength() < 1"
			>
				<li>No valid results or the API is down.</li>
				<li>Try changing your input.</li>
				<li>
					Remember, check to see if this is on
					<a class="text-green-400" href="https://www.last.fm/search">Last.fm</a
					>!
				</li>
			</ul>
			<Tooltip
				v-for="(result, index) in searchResults?.results"
				v-else
				:key="index"
				:tooltip-name="`search-tooltip-${index}`"
				:offset="[0, 8]"
				:delay="500"
				placement="top-start"
			>
				<template #content>
					<div class="uno-album-image-div-wrapper items-center">
						<img
							width="100"
							:height="'artist' in result ? 100 : 150"
							class="cursor-grab"
							:src="`${result.image}`"
							:alt="getMediaNameWithoutNumber(result)"
							@error="
								(event) =>
									((event.target as HTMLImageElement).src =
										`./placeholders/${'artist' in result ? GrayBoxImgFromApiForMusic : GrayBoxImgFromApiForMedia}`)
							"
							loading="lazy"
							draggable="true"
							@click="
								handleClick(
									searchResults?.type === 'album'
										? { type: 'album', result: result as AlbumSearchResult }
										: {
												type: 'media',
												result: result as MovieAndTvSearchResult,
											},
								)
							"
							@dragstart="
								(dragEvent) =>
									onDragStart({
										dragEvent,
										dragSource: 'Search',
										tileObject: result,
										chartType: activeTab,
										originatingIndices: { index1: 0, index2: 0 },
									})
							"
							@touchstart.prevent="
								(touchEvent) =>
									onTouchStart({
										touchEvent,
										album:
											searchResults?.type === 'album'
												? (result as AlbumSearchResult)
												: undefined,
										media:
											searchResults?.type === 'media'
												? (result as MovieAndTvSearchResult)
												: undefined,
										source: 'Search',
										chartType: activeTab,
									})
							"
						/>

						<div
							v-if="
								PLACEHOLDERS.includes(result.image) ||
								result.image === undefined
							"
							class="uno-album-image-text-overlay w-full overflow-clip text-ellipsis"
						>
							<template v-if="searchResults?.type === 'album'">
								{{ (result as AlbumSearchResult).artist }} -
								{{ (result as AlbumSearchResult).name }}
							</template>

							<template v-if="searchResults?.type === 'media'">
								asdasdasd {{ (result as MovieAndTvSearchResult).title }} ({{
									(result as MovieAndTvSearchResult).year
								}})
							</template>
						</div>
					</div>
				</template>
				<template #tooltip>
					<template v-if="searchResults?.type === 'album'">
						{{ (result as AlbumSearchResult).artist }} -
						{{ (result as AlbumSearchResult).name }}
					</template>

					<template v-if="searchResults?.type === 'media'">
						{{ (result as MovieAndTvSearchResult).title }} ({{
							(result as MovieAndTvSearchResult).year
						}})
					</template>
				</template>
			</Tooltip>
		</div>
	</div>
</template>

<style scoped>
.results-div {
	scrollbar-width: thin;
	scrollbar-color: gray dimgray;
}

.tab-container {
	border-bottom: solid 1px;
	border-color: black;
}

.tab-active {
	border-bottom: solid 1px;
	border-color: white;
	background-color: #858383;
}
</style>
