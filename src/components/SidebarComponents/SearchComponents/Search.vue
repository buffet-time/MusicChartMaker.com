<script setup lang="ts">
import { ref, watch } from 'vue'
import type {
	AlbumSearchResult,
	MovieAndTvSearchResult,
	SearchResult,
	SearchResults,
} from '#types'
import { GlobalChartState, GlobalSiteOptions } from '#utils/globals'
import { DragSetData, onTouchStart } from '#utils/drag'
import {
	GrayBoxImgFromApi,
	GrayBoxImgForPlaceholder,
	IsImage,
} from '#utils/misc'

import Tooltip from '#core/Tooltip.vue'
import SearchInput from './SearchInput.vue'
import { searchAlbum } from '#lastfm/main'
import { searchMovie, searchTV } from '#tmdb/main'
import SearchProviderAttribution from './SearchProviderAttribution.vue'
import { getMediaNameWithoutNumber } from '#root/src/utils/chart'

let previousSearch = ''
const searchResults = ref<SearchResults>()
const showSearchResults = ref(false)
const activeTab = ref<Tabs>('Music')

type Tabs = 'Music' | 'Movies' | 'TV'
const tabs: Tabs[] = ['Music', 'Movies', 'TV']

watch(activeTab, () => {
	showSearchResults.value = false
})

function onDragStart(dragEvent: DragEvent, search: SearchResult) {
	DragSetData(dragEvent, {
		albumObject: search.type === 'album' ? search.result : undefined,
		mediaObject: search.type === 'media' ? search.result : undefined,
		dragSource: 'Search',
		originatingIndices: { index1: 0, index2: 0 },
	})

	if (!dragEvent.dataTransfer) {
		return console.error('Error in onDragStart(): ', dragEvent, search)
	}

	dragEvent.dataTransfer.dropEffect = 'copy'
}

function getSearchResultsLength() {
	return searchResults.value ? searchResults.value.results.length : 0
}

function handleClick(result: SearchResult) {
	for (
		let rowIndex = 0;
		rowIndex < GlobalChartState.value.chartTiles.length;
		rowIndex++
	) {
		for (
			let elementIndex = 0;
			elementIndex < GlobalChartState.value.chartTiles[rowIndex].length;
			elementIndex++
		) {
			if (
				GlobalChartState.value.chartTiles[rowIndex][elementIndex].image ===
				GrayBoxImgForPlaceholder
			) {
				switch (result.type) {
					case 'album':
						GlobalChartState.value.options.mediaType = 'album'
						GlobalChartState.value.chartTiles[rowIndex][elementIndex] = {
							// @ts-expect-error - its fine due to the type checking above, im too lazy for proper ts typing
							artist: result.results.artist,
							// @ts-expect-error - its fine due to the type checking above, im too lazy for proper ts typing
							image: result.results.image,
							// @ts-expect-error - its fine due to the type checking above, im too lazy for proper ts typing
							name: result.results.name,
						}
						break

					case 'media':
						//
						//
						//
						//
						//
						//
						// TODO DO STUFF HERE
						GlobalChartState.value.options.mediaType = 'media'
						GlobalChartState.value.chartTiles[rowIndex][elementIndex] = {
							// @ts-expect-error - its fine due to the type checking above, im too lazy for proper ts typing
							artist: result.results.artist,
							// @ts-expect-error - its fine due to the type checking above, im too lazy for proper ts typing
							image: result.results.image,
							// @ts-expect-error - its fine due to the type checking above, im too lazy for proper ts typing
							name: result.results.name,
						}
						break
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

async function searchTv(searchString: string) {
	await searchTV({ term: searchString })
	// showSearchResults.value = false
	// if (searchString === '') {
	// 	return
	// }

	// if (previousSearch === searchString) {
	// 	showSearchResults.value = true
	// 	return
	// }

	// previousSearch = searchString

	// if (await IsImage(searchString)) {
	// 	searchResults.value = [
	// 		{ artist: 'Artist Name', name: 'Album Name', image: searchString },
	// 	]
	// 	showSearchResults.value = true
	// 	return
	// }

	// const albumSearchResults = (await searchMovie(searchString)) ?? []

	// searchResults.value = albumSearchResults

	// if (!showSearchResults.value) {
	// 	showSearchResults.value = true
	// }
}
</script>

<template>
	<div class="flex-col h-full gap-4 mt-1">
		<div class="flex w-full justify-between tab-container mb-1">
			<a
				v-for="tabName in tabs"
				role="button"
				:id="tabName"
				class="flex w-[] h-8 justify-center items-center bg-neutral-500 cursor-pointer"
				:class="{ 'tab-active': activeTab === tabName }"
				:style="{ width: 100 / tabs.length + '%' }"
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
			tv!!!!
		</template>

		<div
			v-if="showSearchResults"
			class="uno-flex-center uno-search-results-div results-div"
			:class="{
				'items-start': getSearchResultsLength() < 1,
				'overflow-hidden': getSearchResultsLength() < 1,
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
					<div class="uno-album-image-div-wrapper">
						<img
							width="100"
							class="cursor-grab"
							:src="`${result.image}`"
							:alt="getMediaNameWithoutNumber(result)"
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
									onDragStart(
										dragEvent,
										searchResults?.type === 'album'
											? { type: 'album', result: result as AlbumSearchResult }
											: {
													type: 'media',
													result: result as MovieAndTvSearchResult,
												},
									)
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
									})
							"
						/>

						<div
							v-if="result.image === GrayBoxImgFromApi"
							class="uno-album-image-text-overlay w-full overflow-clip text-ellipsis"
						>
							<template v-if="searchResults?.type === 'album'">
								{{ (result as AlbumSearchResult).artist }} -
								{{ (result as AlbumSearchResult).name }}
							</template>

							<template v-if="searchResults?.type === 'media'">
								{{ (result as MovieAndTvSearchResult).title }} ({{
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
	/* 96.8px is the height of the search box */
	max-height: calc(100% - 96.8px - 120px);
	height: 100%;
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
