import type { AlbumTile } from '#types'
import { GlobalChartState } from '#shared/globals'
import { FillerAlbum } from '#shared/misc'
import { GrayBoxImgForPlaceholder } from '#shared/misc'

//  blargh
export function colsChanged(difference: number) {
	if (!GlobalChartState) {
		return console.error('error in colsChanged', GlobalChartState)
	}

	if (difference > 0) {
		addColumn(difference)
	} else {
		removeColumn(difference)
	}
}

export function rowsChanged(difference: number) {
	if (!GlobalChartState) {
		return console.error('error in rowsChanged', GlobalChartState)
	}

	// a new row is being added! (easy)
	if (difference > 0) {
		addRow(difference)
	} else {
		removeRow(difference)
	}
}

function addColumn(difference: number) {
	GlobalChartState.value.chartTiles.forEach((row, index) => {
		for (let x = 0; x < difference; x++) {
			row.push(FillerAlbum)
			GlobalChartState.value.options.chartSize.rowSizes[index]++
		}
	})
}

function addRow(difference: number) {
	for (let x = 0; x < difference; x++) {
		const newRow = GlobalChartState.value.chartTiles[
			GlobalChartState.value.chartTiles.length - 1
		].map(() => FillerAlbum)

		GlobalChartState.value.options.chartSize.rowSizes.push(newRow.length)
		GlobalChartState.value.chartTiles.push(newRow)
	}
}

// =====
// TODO: look into keeping a store of the albums removed when they couldn't fit
// =====
// Shared between row and column removal.
function getOneDimensionalArrayFromChartState() {
	const tempArray: AlbumTile[] = []

	for (const outerArray of GlobalChartState.value.chartTiles) {
		for (const givenTile of outerArray) {
			if (givenTile.image !== GrayBoxImgForPlaceholder) {
				tempArray.push(givenTile)
			}
		}
	}

	return tempArray
}

function containsNonPlaceholder(array: AlbumTile[]) {
	// Regular for loop is fine eslint.
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let index = 0; index < array.length; index++) {
		if (array[index].image !== GrayBoxImgForPlaceholder) {
			return true
		}
	}
	return false
}

function createNewMatrix(
	rowsAfterRemoval: number,
	columnsAfterRemoval: number
) {
	const oneDimensionalArray = getOneDimensionalArrayFromChartState()

	const newAlbumTilesMatrix: AlbumTile[][] = []

	for (let outerIndex = 0; outerIndex < rowsAfterRemoval; outerIndex++) {
		// create an empty array for the given row to add elements into
		newAlbumTilesMatrix.push([])

		for (let innerIndex = 0; innerIndex < columnsAfterRemoval; innerIndex++) {
			// remove the first element from the array
			const elementToInsert = oneDimensionalArray.shift()

			if (elementToInsert) {
				newAlbumTilesMatrix[outerIndex].push(elementToInsert)
			} else {
				newAlbumTilesMatrix[outerIndex].push(FillerAlbum)
			}
		}
	}

	return newAlbumTilesMatrix
}

// Top level idea of how to remove properly
// 0 ) make sure the row and or rows that are being removed are not just placeholders so we can skip
// 1 ) look through the original matrix
//     create a one dimensional array containing all of the non placeholders
// 2 ) if the array is smaller than what will eventually be added, plug in placeholders at the end
// 3 ) create a new matrix with the expected new size
// traverse that matrix and fill in with the values from the array we created above
// 4 ) set the GlobalChartState to the new matrix

// COLUMN REMOVAL
function removeColumn(nonAbsoluteDifference: number) {
	const difference = Math.abs(nonAbsoluteDifference)

	if (checkToSeeIfTheColumnsCanBeTriviallyRemoved(difference)) {
		trivialColumnRemoval(difference)
		return
	}

	const rowsAfterRemoval = GlobalChartState.value.chartTiles.length
	const numberOfColumns =
		GlobalChartState.value.options.chartSize.rowSizes[0] - difference
	const newAlbumTilesMatrix = createNewMatrix(rowsAfterRemoval, numberOfColumns)

	for (
		let index = 0;
		index < GlobalChartState.value.options.chartSize.rowSizes.length;
		index++
	) {
		GlobalChartState.value.options.chartSize.rowSizes[index] -= difference
	}

	GlobalChartState.value.chartTiles = newAlbumTilesMatrix
}

function checkToSeeIfTheColumnsCanBeTriviallyRemoved(difference: number) {
	const tempArray: AlbumTile[] = []

	for (const tileArray of GlobalChartState.value.chartTiles) {
		tileArray
			.slice(GlobalChartState.value.options.chartSize.rowSizes[0] - difference)
			.forEach((value) => tempArray.push(value))
	}

	if (!containsNonPlaceholder(tempArray)) {
		return true
	}

	return false
}

function trivialColumnRemoval(difference: number) {
	GlobalChartState.value.chartTiles.forEach((row, index) => {
		for (let x = 0; x < difference; x++) {
			row.pop()
			GlobalChartState.value.options.chartSize.rowSizes[index]--
		}
	})
}

// ROW REMOVAL
function removeRow(nonAbsoluteDifference: number) {
	const difference = Math.abs(nonAbsoluteDifference)
	// First check to make sure we can't do it trivially

	if (checkToSeeIfTheRowsCanBeTriviallyRemoved(difference)) {
		removeRows(difference)
		return
	}

	const rowsAfterRemoval = GlobalChartState.value.chartTiles.length - difference
	const numberOfColumns = GlobalChartState.value.options.chartSize.rowSizes[0]
	const newAlbumTilesMatrix = createNewMatrix(rowsAfterRemoval, numberOfColumns)

	for (let index = 0; index < difference; index++) {
		GlobalChartState.value.options.chartSize.rowSizes.pop()
	}

	GlobalChartState.value.chartTiles = newAlbumTilesMatrix
}

function checkToSeeIfTheRowsCanBeTriviallyRemoved(difference: number) {
	for (let index = 0; index < difference; index++) {
		if (
			!containsNonPlaceholder(
				GlobalChartState.value.chartTiles[
					GlobalChartState.value.chartTiles.length - 1 - index
				]
			)
		) {
			return true
		}
	}
	return false
}

function removeRows(difference: number) {
	for (let x = 0; x < difference; x++) {
		GlobalChartState.value.options.chartSize.rowSizes.pop()
		GlobalChartState.value.chartTiles.pop()
	}
}
