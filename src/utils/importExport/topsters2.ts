import {
	GlobalChartState,
	selectedChartTitle,
	StoredChartNames,
} from '#utils/globals'

import {
	GenerateChartWithValues,
	PreventNameCollision,
	top100,
	top42,
} from '#utils/chart'

import { setCurrentChart, setStoredChart } from '#utils/storage'
import type { AlbumTile } from '#types'

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

function getPartiallyDecodedTopsters2Cards({
	propertyName,
	decodedTopsters2,
}: {
	propertyName: string
	decodedTopsters2: Topsters2DecodedJson
}) {
	return Uint8Array.from(
		atob(
			decodedTopsters2[propertyName].substring(
				1,
				decodedTopsters2[propertyName].length - 1,
			),
		),
		(character: string) => character.charCodeAt(0),
	)
}

async function getDecodedTopsters2CardsArray(
	partiallyDecodedTopsters2Cards: Uint8Array,
) {
	const { inflate } = await import('pako')
	const textDecoder = new TextDecoder()
	return JSON.parse(
		textDecoder.decode(inflate(partiallyDecodedTopsters2Cards)),
	) as Topsters2ChartArray
}

// Lots of explanation required
// The nazi who made Topsters 2 decided to heavily obfuscate the exported files
// Steps taken here
// 1) Read the file as text and ensure that it exists
// 2) Decode the Base64 bitshifted string that that the file is as default and Parse that to be JSON
// 3) Take this now decoded JSON file and then get the name of the key with `cards-cards`
//   a) There are 2 `cards` properties one has some data but is incomplete
//   b) the other has the actual chart data
//   c) sometimes its named `cards` and other time its the name of the chart and cards-cards
// 4) This value is also Encoded, it's a compressed bit of data in Uint8Array that is Base64 encoded
// 5) Once this is a Uint8Array we then need to take that do a decompression (inflate) on it
// 6) Take that inflated value, decode it with a TextDecoder, and finally Parse it into JSON
// 7) Now we can take this unobfuscated JSON and use it to generate a chart in MusicChartMaker.com
export function importFromTopsters2(event: Event) {
	try {
		// @ts-expect-error - this is fine, I just need to be less lazy with Typings
		const topsters2ExportFile = event.target?.files[0]
		if (!topsters2ExportFile) {
			return
		}
		const fileReader = new FileReader()

		fileReader.onload = async (event) => {
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
							String.fromCharCode(currentCharacter.charCodeAt(0) - 17),
						)
						.join(''),
				),
			)[0] as Topsters2DecodedJson

			const topsters2Keys = Object.keys(decodedTopsters2)

			const namedCardsProperty = topsters2Keys.find((value) =>
				value.includes('cards-cards'),
			)
			let partiallyDecodedTopsters2Cards: Uint8Array
			let decodedTopsters2CardsArray: Topsters2ChartArray

			if (
				namedCardsProperty &&
				decodedTopsters2[namedCardsProperty].length >
					decodedTopsters2.cards.length
			) {
				partiallyDecodedTopsters2Cards = getPartiallyDecodedTopsters2Cards({
					propertyName: namedCardsProperty,
					decodedTopsters2,
				})

				decodedTopsters2CardsArray = await getDecodedTopsters2CardsArray(
					partiallyDecodedTopsters2Cards,
				)
			} else {
				partiallyDecodedTopsters2Cards = getPartiallyDecodedTopsters2Cards({
					propertyName: 'cards',
					decodedTopsters2,
				})

				decodedTopsters2CardsArray = await getDecodedTopsters2CardsArray(
					partiallyDecodedTopsters2Cards,
				)
			}

			decodedTopsters2CardsArray.splice(Number(decodedTopsters2.size))

			const newAlbumTileArray: AlbumTile[][] = []
			let usedRowSizes: number[] = []

			const chartSize = Number(decodedTopsters2.size)

			switch (chartSize) {
				case 100: {
					topsters2CardsArrayToAlbumTileArrayArray({
						decodedTopsters2CardsArray,
						newAlbumTileArray,
						rowSizes: top100.rowSizes,
					})
					usedRowSizes = top100.rowSizes
					break
				}
				case 42: {
					topsters2CardsArrayToAlbumTileArrayArray({
						decodedTopsters2CardsArray,
						newAlbumTileArray,
						rowSizes: top42.rowSizes,
					})
					usedRowSizes = top42.rowSizes
					break
				}
				case 40: {
					// 40 = 5 x 8
					const rowSizesFor40 = [8, 8, 8, 8, 8]
					topsters2CardsArrayToAlbumTileArrayArray({
						decodedTopsters2CardsArray,
						newAlbumTileArray,
						rowSizes: rowSizesFor40,
					})
					usedRowSizes = rowSizesFor40
					break
				}

				default: {
					const factorsForRowSizes = getFactorsFromLength(chartSize)
					const generatedRowSizes: number[] = []
					for (let index = 0; index < factorsForRowSizes[0]; index++) {
						generatedRowSizes.push(factorsForRowSizes[1])
						index++
					}

					topsters2CardsArrayToAlbumTileArrayArray({
						decodedTopsters2CardsArray,
						newAlbumTileArray,
						rowSizes: generatedRowSizes,
					})
					usedRowSizes = generatedRowSizes
					break
				}
			}

			const pulledNameFromJson = topsters2Keys
				.filter((value) => value.includes('titled'))
				.find((value) => value.includes('cards'))
				?.replace('-cards-titled', '')

			const newChartNameToSave = PreventNameCollision(
				pulledNameFromJson ? pulledNameFromJson : 'FailedToImportChartName',
			)

			// TODO: look into changing the default options
			const newChart = GenerateChartWithValues(
				newChartNameToSave,
				newAlbumTileArray,
				{
					default: false,
					rowSizes: usedRowSizes,
					presetName: 'Topsters2Import',
				},
			)

			// TODO: Look into extracting this out!
			StoredChartNames.value.unshift(newChartNameToSave)
			selectedChartTitle.value = newChartNameToSave
			setCurrentChart(newChartNameToSave)
			setStoredChart(newChartNameToSave, newChart)
			GlobalChartState.value = newChart
		}
		fileReader.readAsText(topsters2ExportFile)
	} catch (error: any) {
		console.error(`Error: ${error}`)
	}
}

// Will give back the most squareish factors from all values possible
function getFactorsFromLength(chartLength: number): [number, number] {
	const sqrtOfKey = Math.sqrt(chartLength)
	if (sqrtOfKey % 1 === 0 && sqrtOfKey * sqrtOfKey === chartLength) {
		return [sqrtOfKey, sqrtOfKey]
	}

	const allFactors = [...Array(chartLength + 1).keys()].filter(
		(index) => chartLength % index === 0,
	)

	const firstPossibleFactor = allFactors[allFactors.length / 2 - 1]
	const secondPossibleFactor = allFactors[allFactors.length / 2]

	return [firstPossibleFactor, secondPossibleFactor]
}

function topsters2CardsArrayToAlbumTileArrayArray({
	rowSizes,
	newAlbumTileArray,
	decodedTopsters2CardsArray,
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
					name: topsters2titleSplit[1],
				}
			}),
		)
	}
}
