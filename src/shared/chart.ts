import type { ChartPreset, ChartState, AlbumTile } from '#types'
import { FillerAlbum } from '#shared/misc'
import { getAllSavedKeys } from '#shared/storage'

export const top42: ChartPreset = {
	default: true,
	presetName: 'Top 42',
	rowSizes: [5, 5, 6, 6, 10, 10]
}
export const top100: ChartPreset = {
	default: true,
	presetName: 'Top 100',
	rowSizes: [5, 5, 6, 6, 6, 10, 10, 10, 14, 14, 14]
}
const numberInParensRegex = /\s\((\d+)\)$/

const defaultChartName = 'New Album Chart'
const baseOptionsDefault = {
	displayNumberRank: true,
	displayTitles: false,
	displayPlaycount: false,
	background: '#303030',
	textColor: '#FFFFFF',
	textBorderColor: '#000000',
	fontSize: 14,
	textSpacing: 0,
	font: 'Arial',
	padding: 0.2,
	backgroundImage: undefined
}

export function GenerateDefaultChart(title?: string): ChartState {
	const albumArray = [] as AlbumTile[][]
	const defaultChartSize: ChartPreset = {
		default: true,
		presetName: 'Dynamic',
		rowSizes: [3, 3, 3]
	}

	defaultChartSize.rowSizes.forEach((size, index) => {
		albumArray.push([])
		for (let x = 0; x < size; x++) {
			albumArray[index].push(FillerAlbum)
		}
	})

	return {
		options: {
			...baseOptionsDefault,
			chartSize: defaultChartSize,
			chartTitle: title ? title : defaultChartName,
			preset: undefined
		},
		chartTiles: albumArray
	}
}

export function PreventNameCollision(name: string): string {
	const storedCharts = getAllSavedKeys()

	function GetUnusedName(name: string): string {
		if (storedCharts.some((storedName) => storedName === name)) {
			const matchArray = name.match(numberInParensRegex)
			if (matchArray) {
				return GetUnusedName(
					name.replace(numberInParensRegex, ` (${Number(matchArray[1]) + 1})`)
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
	preset: ChartPreset
): ChartState {
	const albumArray: AlbumTile[][] = []

	preset.rowSizes.forEach((size, index) => {
		albumArray.push([])
		for (let x = 0; x < size; x++) {
			albumArray[index].push(FillerAlbum)
		}
	})

	return {
		options: {
			...baseOptionsDefault,
			chartSize: preset,
			chartTitle: title ? title : defaultChartName,
			preset: true
		},
		chartTiles: albumArray
	}
}

export function GenerateChartWithValues(
	title: string,
	chartValues: AlbumTile[][],
	preset?: ChartPreset
): ChartState {
	return {
		options: {
			...baseOptionsDefault,
			chartSize: preset
				? preset
				: {
						default: false,
						presetName: 'Dynamic',
						rowSizes: chartValues.map((chart) => chart.length)
				  },
			chartTitle: title ? title : defaultChartName,
			preset: preset ? true : undefined
		},
		chartTiles: chartValues
	}
}
