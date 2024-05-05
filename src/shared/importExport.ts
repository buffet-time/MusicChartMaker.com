import { inflate } from 'pako'
import {
	GlobalChartState,
	GlobalSiteOptions,
	selectedChartTitle,
	StoredChartNames
} from '#shared/globals'
import type { AlbumTile, ChartState, SiteOptions } from '#types'

import {
	getAllSavedKeys,
	getFirstChart,
	GetSiteOptions,
	getStoredChart,
	setCurrentChart,
	setStoredChart
} from '#shared/storage'
import {
	GenerateChartWithValues,
	PreventNameCollision,
	top100,
	top42
} from './chart'

type BooleanButStrings = 'true' | 'false'

interface Topsters2DecodedJson {
	background: string
	cards: string
	custom: string
	numbered: BooleanButStrings
	options: string
	size: string
	titled: BooleanButStrings
	// the others will be similar to
	// "Top100 Dec 2023-cards-background":
	// "Top100 Dec 2023-cards-size":
	// "Top100 Dec 2023-cards-titled":
	// "Top100 Dec 2023-cards-custom":
	// "Top100 Dec 2023-cards-cards":
	// "Top100 Dec 2023-cards-numbered":
	[key: string]: string
}

type Topsters2ChartArray = {
	src: string
	title: string
	playcount: string
}[]

export interface FinalReturnedTopsters2Json {
	background: string
	// custom: string
	// numbered: BooleanButStrings
	// options: string
	// size: string
	// titled: BooleanButStrings
	cards: Topsters2ChartArray
}

// Lots of explanation required
// The nazi who made Topsters 2 decided to heavily obfuscate the exported files
// Steps taken here
// 1) Read the file as text and ensure that it exists
// 2) Decode the Base64 bitshifted string that that the file is as default and Parse that to be JSON
// 3) Take this now decoded JSON file and then get the name of the key with `cards-cards`
//   a) There are 2 `cards` properties one has some data but is incomplete
//   b) the other has the actual chart data
// 4) This value is also Encoded, it's a compressed bit of data in Uint8Array that is Base64 encoded
// 5) Once this is a Uint8Array we then need to take that do a decompression (inflate) on it
// 6) Take that inflated value, decode it with a TextDecoder, and finally Parse it into JSON
// 7) Now we can take this unobfuscated JSON and use it to generate a chart in MusicChartMaker.com
export function importFromTopsters2(event: Event) {
	try {
		// @ts-expect-error - this is fine, I just need to be less lazy with Typings
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		const topsters2ExportFile = event.target?.files[0]
		if (!topsters2ExportFile) {
			return
		}
		const fileReader = new FileReader()
		const textDecoder = new TextDecoder()

		fileReader.onload = (event) => {
			const encodedTopsters2 = event.target?.result
			if (!encodedTopsters2) {
				// BAD PATH REACHED!
				// TODO handle this
				return
			}

			const decodedTopsters2 = JSON.parse(
				atob(
					(encodedTopsters2 as string)
						.split('')
						.map((currentCharacter) =>
							// Base64 characters that are shifted by 17
							String.fromCharCode(currentCharacter.charCodeAt(0) - 17)
						)
						.join('')
				)
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			)[0] as Topsters2DecodedJson

			const topsters2Keys = Object.keys(decodedTopsters2)

			const namedCardsProperty = topsters2Keys.find((value) =>
				value.includes('cards-cards')
			)

			const partiallyDecodedTopsters2Cards = Uint8Array.from(
				atob(
					decodedTopsters2[`${namedCardsProperty}`].substring(
						1,
						decodedTopsters2[`${namedCardsProperty}`].length - 1
					)
				),
				(character: string) => character.charCodeAt(0)
			)

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const decodedTopsters2CardsArray = JSON.parse(
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
				textDecoder.decode(inflate(partiallyDecodedTopsters2Cards))
			) as Topsters2ChartArray

			decodedTopsters2CardsArray.splice(Number(decodedTopsters2.size))

			console.log(10, decodedTopsters2)

			// const returnObject = {
			// 	background: decodedTopsters2.background,
			// 	cards: decodedTopsters2CardsArray
			// } as FinalReturnedTopsters2Json

			const newAlbumTileArray: AlbumTile[][] = []
			let usedRowSizes: number[] = []

			switch (Number(decodedTopsters2.size)) {
				// 25 = 5 x 5
				// 40 = 5 x 8
				case 100: {
					topsters2CardsArrayToAlbumTileArrayArray({
						decodedTopsters2CardsArray,
						newAlbumTileArray,
						rowSizes: top100.rowSizes
					})
					usedRowSizes = top100.rowSizes
					break
				}
				case 42: {
					topsters2CardsArrayToAlbumTileArrayArray({
						decodedTopsters2CardsArray,
						newAlbumTileArray,
						rowSizes: top42.rowSizes
					})
					usedRowSizes = top42.rowSizes
					break
				}

				default:
					break
			}

			console.log(10, newAlbumTileArray)

			const pulledNameFromJson = topsters2Keys
				.filter((value) => value.includes('titled'))
				.find((value) => value.includes('cards'))
				?.replace('-cards-titled', '')

			const newChartNameToSave = PreventNameCollision(
				pulledNameFromJson ? pulledNameFromJson : 'FailedToImportChartName'
			)

			// TODO: look into changing the default options
			const newChart = GenerateChartWithValues(
				newChartNameToSave,
				newAlbumTileArray,
				{
					default: false,
					rowSizes: usedRowSizes,
					presetName: 'Topsters2Import'
				}
			)

			// TODO: Look into extracting this out!
			StoredChartNames.value.unshift(newChartNameToSave)
			selectedChartTitle.value = newChartNameToSave
			setCurrentChart(newChartNameToSave)
			setStoredChart(newChartNameToSave, newChart)
			GlobalChartState.value = newChart

			console.log(newChart, newChartNameToSave)
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		fileReader.readAsText(topsters2ExportFile)
	} catch (error: any) {
		console.error(`Error: ${error}`)
	}
}

function topsters2CardsArrayToAlbumTileArrayArray({
	rowSizes,
	newAlbumTileArray,
	decodedTopsters2CardsArray
}: {
	rowSizes: number[]
	newAlbumTileArray: AlbumTile[][]
	decodedTopsters2CardsArray: Topsters2ChartArray
}) {
	for (const rowSize of rowSizes) {
		const splicedSection = decodedTopsters2CardsArray.splice(0, rowSize)
		newAlbumTileArray.push(
			splicedSection.map((topsters2Item) => {
				const topsters2titleSplit = topsters2Item.title.split(' - ')
				return {
					image: topsters2Item.src,
					artist: topsters2titleSplit[0],
					name: topsters2titleSplit[1]
				}
			})
		)
	}
}

// Exports all charts and site options!
export function ExportChartsAndOptions() {
	try {
		// Node does not work here, have to use WebAPI
		const exportdata = {
			chartData: getAllSavedKeys().map((cName) => getStoredChart(cName)),
			siteData: GetSiteOptions()
		}
		const anchor = document.createElement('a')
		const file = new Blob([JSON.stringify(exportdata)], { type: 'text/plain' })
		anchor.href = URL.createObjectURL(file)
		anchor.download = 'exported_charts.json'
		anchor.click()
	} catch (error) {
		console.error('Error attempting to export chart data!', error)
	}
}

// Imports all charts and site options!
export function ImportChartsAndOptions(importFile: File | null) {
	try {
		if (!importFile) {
			throw new Error('No File Submitted')
		}

		const reader = new FileReader()

		reader.onerror = (errorEvt) => {
			throw errorEvt.target?.error
		}

		reader.onload = (fileEvent) => {
			// console.log(fileEvent)
			// Add logic here to check filename and see if it is a JSON file.
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const parsed = JSON.parse(String(fileEvent.target?.result))
				// Add a typecheck here, assert if it has the siteData and chartData properties
				if (parsed) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
					const options: SiteOptions = parsed.siteData

					GlobalSiteOptions.value = options
					setCurrentChart(options.currentChart)
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
					const data: ChartState[] = parsed.chartData
					data.forEach((state) => {
						!!state && setStoredChart(state.options.chartTitle, state)
					})
					const chart = getStoredChart(options.currentChart) ?? getFirstChart()
					if (chart) {
						GlobalChartState.value = chart
					}
					StoredChartNames.value = getAllSavedKeys()
					return
				}

				// handle this annd show to user...
				throw new Error('Unsupported File/Unexpected Contents')
			} catch (error) {
				// handle this and show to user...
				console.error('Failed to import selected file => Error:', error)
			}
		}

		reader.readAsText(importFile, 'UTF-8')
	} catch (error) {
		console.error('Failed to import selected file => Error:', error)
	}
}
