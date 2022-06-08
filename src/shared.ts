import { ref, type Ref } from 'vue'
import { getAllSavedKeys } from './storage'
import {
	type ChartSize,
	type SiteOptions,
	type AlbumTile,
	type ChartState,
	type DragDataTransfer,
	IndicesObject
} from './types'

export const GrayBoxImg = 'https://i.imgur.com/5IYcmZz.jpg'

export const FillerAlbum = {
	artist: 'Artist',
	name: 'Album',
	image: GrayBoxImg
}

// // // // // //
// Site stuff
// // // // // //
export const GlobalSiteOptions = ref() as Ref<SiteOptions>

export function GenerateDefaultSiteOptions(): SiteOptions {
	return {
		numberOfSearchResults: 10,
		currentChart: 'New Album Chart'
	}
}

// // // // // // // //
// Function wrappers
// // // // // // // //
export async function ProperFetch(url: string): Promise<any | null> {
	// This is a wrapper around the Fetch WebAPI to handle errors without any fuss
	try {
		const response = await fetch(url)

		if (response.ok) {
			return await response.json()
		} else {
			console.error('Responded with an error:' + (await response.json()))
			return null
		}
	} catch (error) {
		console.error(`Error in fetch call: ${error}`)
		return null
	}
}

// // // //
// Other
// // // //
export function IsImage(input: string): Promise<boolean> {
	// returns a Promise that'll resolve to a boolean whether or not an input is an image
	return new Promise((resolve) => {
		const image = new Image()
		image.onerror = image.onabort = () => {
			resolve(false)
		}
		image.onload = () => {
			resolve(true)
		}
		image.src = input
	})
}

// // // // // //
// Drag Stuff
// // // // // //
export function DragSetData(
	dragEvent: DragEvent,
	objectToTransfer: DragDataTransfer
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	dragEvent.dataTransfer!.setData(
		'text/plain',
		JSON.stringify(objectToTransfer)
	)
}

export function RearrangeChart(
	{ index1: targetIndex1, index2: targetIndex2 }: IndicesObject,
	{ index1: originIndex1, index2: originIndex2 }: IndicesObject
) {
	if (targetIndex1 === originIndex1) {
		// they're in the same array (read row) so it's simple and 1 dimensional
		const tile = GlobalChartState.value.chartTiles[originIndex1].splice(
			originIndex2,
			1
		)[0]
		GlobalChartState.value.chartTiles[targetIndex1].splice(
			targetIndex2,
			0,
			tile
		)
		return
	}
	// have to do more complex stuff here because its moving 2 dimensionally\

	// First splice out the tile we're moving
	const movingTile = GlobalChartState.value.chartTiles[originIndex1].splice(
		originIndex2,
		1
	)[0]

	// Moving The album up
	if (targetIndex1 < originIndex1) {
		// next place that in its new spot
		GlobalChartState.value.chartTiles[targetIndex1].splice(
			targetIndex2,
			0,
			movingTile
		)

		// now iteratively move through all arrays
		// popping the last one in the array and splicing it to the front of the next array
		// until we see that we're in the array that it was originally moved from
		for (let index = targetIndex1; index < originIndex1; index++) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const poppedTile = GlobalChartState.value.chartTiles[index].pop()!
			GlobalChartState.value.chartTiles[index + 1].splice(0, 0, poppedTile)
		}
	}

	// Moving The album down
	else {
		// next place that in its new spot
		GlobalChartState.value.chartTiles[targetIndex1].splice(
			targetIndex2 + 1,
			0,
			movingTile
		)

		// now iteratively move through all arrays
		// popping the first one in the array and splicing it to the back of the previous array
		// until we see that we're in the array that it was originally moved from
		for (let index = targetIndex1; index > originIndex1; index--) {
			const poppedTile = GlobalChartState.value.chartTiles[index].splice(
				0,
				1
			)[0]
			GlobalChartState.value.chartTiles[index - 1].splice(
				GlobalChartState.value.chartTiles[index - 1].length,
				0,
				poppedTile
			)
		}
	}
}

// // // // // //
// Chart stuff
// // // // // //
export const GlobalChartState = ref() as Ref<ChartState>

// enhance this to prevent name collisions (vineet would hate this)
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
			textBorderColor: '#000000'
		},
		chartTiles: albumArray
	}
}

const numberInParensRegex = /\s\((\d+)\)$/
export function PreventNameCollision(name: string): string {
	const storedCharts = getAllSavedKeys()

	function GetUnusedName(name: string): string {
		if (storedCharts.some((storedName) => storedName === name)) {
			const matchArray = name.match(numberInParensRegex)
			if (matchArray) {
				return GetUnusedName(
					name.replace(numberInParensRegex, ` (${Number(matchArray[1]) + 1})`)
				)
			} else {
				return GetUnusedName(`${name} (1)`)
			}
		} else {
			return name
		}
	}

	return GetUnusedName(name)
}
