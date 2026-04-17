import type {
	ChartPreset,
	ChartState,
	ChartOptions,
	AlbumSearchResult,
	MovieAndTvSearchResult,
} from '#types'
import { FillerAlbum, FillerMedia } from '#utils/misc'
import { getAllSavedKeys } from '#utils/storage'
import { GlobalChartState } from './globals'

export const top42: ChartPreset = {
	default: true,
	presetName: 'Top 42',
	rowSizes: [5, 5, 6, 6, 10, 10],
}
export const top100: ChartPreset = {
	default: true,
	presetName: 'Top 100',
	rowSizes: [5, 5, 6, 6, 6, 10, 10, 10, 14, 14, 14],
}
const numberInParensRegex = /\s\((\d+)\)$/

const defaultChartSize: ChartPreset = {
	default: true,
	presetName: 'Dynamic',
	rowSizes: [3, 3, 3],
}

const defaultChartName = 'New Album Chart'
const baseOptionsDefault = {
	displayNumberRank: true,
	displayTitles: false,
	background: '#303030',
	textColor: '#FFFFFF',
	fontSize: 16,
	textSpacing: 0,
	font: 'Arial',
	padding: 0.2,
	backgroundImage: undefined,
	textShadow: '0px 0px 0px #FFFFFF',
	constrainTitles: false,
	constrainTitlesCentered: false,
	mediaType: 'album',
} satisfies Partial<ChartOptions>

export function GenerateDefaultChart(title?: string): ChartState {
	const mediaArray = [] as AlbumSearchResult[][] | MovieAndTvSearchResult[][]
	defaultChartSize.rowSizes.forEach((size, index) => {
		mediaArray.push([])
		for (let x = 0; x < size; x++) {
			switch (GlobalChartState.value.options.mediaType) {
				case 'media':
					// @ts-expect-error - the media type determines.
					mediaArray[index].push(FillerAlbum)
					break
				case 'album':
				default:
					// @ts-expect-error - the media type determines.
					mediaArray[index].push(FillerMedia)
					break
			}
		}
	})

	return {
		options: {
			...baseOptionsDefault,
			chartSize: defaultChartSize,
			chartTitle: title ? title : defaultChartName,
			preset: undefined,
		},
		chartTiles: mediaArray,
	}
}

export function PreventNameCollision(name: string): string {
	const storedCharts = getAllSavedKeys()

	function GetUnusedName(name: string): string {
		if (storedCharts.some((storedName) => storedName === name)) {
			const matchArray = numberInParensRegex.exec(name)
			if (matchArray) {
				return GetUnusedName(
					name.replace(numberInParensRegex, ` (${Number(matchArray[1]) + 1})`),
				)
			}
			return GetUnusedName(`${name} (1)`)
		}
		return name
	}

	return GetUnusedName(name)
}

export function GeneratePresetChart(
	title: string,
	preset: ChartPreset,
): ChartState {
	const mediaArray: AlbumSearchResult[][] | MovieAndTvSearchResult[][] = []

	preset.rowSizes.forEach((size, index) => {
		mediaArray.push([])
		for (let x = 0; x < size; x++) {
			switch (GlobalChartState.value.options.mediaType) {
				case 'media':
					// @ts-expect-error - the media type determines.
					mediaArray[index].push(FillerAlbum)
					break
				case 'album':
				default:
					// @ts-expect-error - the media type determines.
					mediaArray[index].push(FillerMedia)
					break
			}
		}
	})

	return {
		options: {
			...baseOptionsDefault,
			chartSize: preset,
			chartTitle: title ? title : defaultChartName,
			preset: true,
		},
		chartTiles: mediaArray,
	}
}

export function GenerateChartWithValues(
	title: string,
	chartValues: AlbumSearchResult[][] | MovieAndTvSearchResult[][],
	preset?: ChartPreset,
): ChartState {
	return {
		options: {
			...baseOptionsDefault,
			chartSize: preset
				? preset
				: {
						default: false,
						presetName: 'Dynamic',
						rowSizes: chartValues.map((chart) => chart.length),
					},
			chartTitle: title ? title : defaultChartName,
			preset: preset ? true : undefined,
		},
		chartTiles: chartValues,
	}
}

export const idForFirstImage = 'fistImageId'
export function GetHeightOfImages() {
	const firstImage = document.getElementById(idForFirstImage)
	const heightOfImages = firstImage?.getBoundingClientRect().height

	return heightOfImages ?? 300
}

export function getAlbumNumber(indexOne: number, indexTwo: number): number {
	if (!GlobalChartState) {
		console.error(
			'Error getting GlobalChartState in getAlbumNumber()',
			GlobalChartState,
		)
		return 0
	}
	let returnValue = 0

	for (let x = 0; x < indexOne; x++) {
		returnValue += GlobalChartState.value.options.chartSize.rowSizes[x]
	}

	return returnValue + 1 + indexTwo
}

export function getMediaNameWithNumber({
	index1,
	index2,
	media,
}: {
	index1: number
	index2: number
	media: AlbumSearchResult | MovieAndTvSearchResult
}): string | undefined {
	const albumNumber = getAlbumNumber(index1, index2)

	if ('title' in media) {
		return media.title === 'Title' && media.year === '2019'
			? undefined
			: `${albumNumber}: ${media.title} (${media.year})`
	}

	return media.artist === 'Artist' && media.name === 'Album'
		? undefined
		: `${albumNumber}: ${media.artist} - ${media.name}`
}

export function getMediaNameWithoutNumber(
	media: AlbumSearchResult | MovieAndTvSearchResult,
) {
	if ('artist' in media) {
		return `${media.artist} - ${media.name}`
	}

	return `${media.title} (${media.year})`
}
