import {
	type ChartSize,
	type ChartState,
	type AlbumTile,
	type Preset
} from '#types'
import { FillerAlbum } from '#shared/misc'
import { getAllSavedKeys } from '#shared/storage'

const top42: ChartSize = {
	numberOfTiles: 42,
	numberOfRows: 6,
	rowSizes: [5, 5, 6, 6, 10, 10]
}
const top100: ChartSize = {
	numberOfTiles: 100,
	numberOfRows: 11,
	rowSizes: [5, 5, 6, 6, 6, 10, 10, 10, 14, 14, 14]
}
const numberInParensRegex = /\s\((\d+)\)$/

export function GenerateDefaultChart(title?: string): ChartState {
	const albumArray = [] as AlbumTile[][]
	const defaultChartSize: ChartSize = {
		numberOfTiles: 9,
		rowSizes: [3, 3, 3],
		numberOfRows: 3
	}

	defaultChartSize.rowSizes.forEach((size, index) => {
		albumArray.push([])
		for (let x = 0; x < size; x++) {
			albumArray[index].push(FillerAlbum)
		}
	})

	return {
		options: {
			chartSize: defaultChartSize,
			chartTitle: title ? title : 'New Album Chart',
			displayNumberRank: true,
			displayTitles: true,
			displayPlaycount: false,
			background: '#303030',
			textColor: '#FFFFFF',
			textBorderColor: '#000000',
			fontSize: 14,
			textSpacing: 0,
			font: 'Arial',
			padding: 0.2,
			backgroundImage: undefined,
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

export function GeneratePresetChart(title: string, preset: Preset): ChartState {
	const albumArray = [] as AlbumTile[][]
	let presetChartSize: ChartSize

	if (preset === 'Top 100') {
		presetChartSize = top100
	} else {
		presetChartSize = top42
	}

	presetChartSize.rowSizes.forEach((size, index) => {
		albumArray.push([])
		for (let x = 0; x < size; x++) {
			albumArray[index].push(FillerAlbum)
		}
	})

	return {
		options: {
			chartSize: presetChartSize,
			chartTitle: title ? title : 'New Album Chart',
			displayNumberRank: true,
			displayTitles: true,
			displayPlaycount: false,
			background: '#303030',
			textColor: '#FFFFFF',
			textBorderColor: '#000000',
			preset: preset,
			fontSize: 14,
			textSpacing: 0,
			font: 'Arial',
			backgroundImage: undefined,
			padding: 0.2
		},
		chartTiles: albumArray
	}
}
