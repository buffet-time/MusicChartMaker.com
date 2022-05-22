import { ref, type Ref } from 'vue'
import {
	ChartSize,
	type AlbumTile,
	type ChartState,
	type DragDataTransfer
} from './types'

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

// // // // // //
// Chart stuff
// // // // // //
export const GlobalChartState = ref() as Ref<ChartState>

// enhance this to prevent name collisions (vineet would hate this)
export function GenerateDefaultChart(): ChartState {
	const albumArray = [] as AlbumTile[]
	const defaultChartSize: ChartSize = { columns: 3, rows: 3 }

	for (let x = 0; x < defaultChartSize.rows * defaultChartSize.columns; x++) {
		albumArray.push({
			artist: '',
			name: '',
			image: 'https://i.imgur.com/5IYcmZz.jpg'
		})
	}

	return {
		options: {
			chartSize: defaultChartSize,
			chartTitle: 'New Album Chart',
			displayNumberRank: false,
			displayTitles: false,
			displayPlaycount: false
		},
		chartTiles: albumArray
	}
}
