import type { DragDataTransfer, IndicesObject, AlbumSearchResult } from '#types'
import { GlobalChartState } from '#shared/globals'
import { GrayBoxImg } from './misc'

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
	{ index1: originIndex1, index2: originIndex2 }: IndicesObject,
	swap?: boolean
) {
	if (!GlobalChartState) {
		return console.error(
			'Error getting GlobalChartState in RearrangeChart()',
			GlobalChartState
		)
	}

	// Swap the 2 elements
	if (swap) {
		const targetTile = GlobalChartState.chartTiles[targetIndex1][targetIndex2]
		GlobalChartState.chartTiles[targetIndex1][targetIndex2] =
			GlobalChartState.chartTiles[originIndex1][originIndex2]
		GlobalChartState.chartTiles[originIndex1][originIndex2] = targetTile
		return
	}

	if (targetIndex1 === originIndex1) {
		// they're in the same array (read row) so it's simple and 1 dimensional
		const tile = GlobalChartState.chartTiles[originIndex1].splice(
			originIndex2,
			1
		)[0]
		GlobalChartState.chartTiles[targetIndex1].splice(targetIndex2, 0, tile)
		return
	}
	// have to do more complex stuff here because its moving 2 dimensionally\

	// First splice out the tile we're moving
	const movingTile = GlobalChartState.chartTiles[originIndex1].splice(
		originIndex2,
		1
	)[0]

	// Moving The album up
	if (targetIndex1 < originIndex1) {
		// next place that in its new spot
		GlobalChartState.chartTiles[targetIndex1].splice(
			targetIndex2,
			0,
			movingTile
		)

		// now iteratively move through all arrays
		// popping the last one in the array and splicing it to the front of the next array
		// until we see that we're in the array that it was originally moved from
		for (let index = targetIndex1; index < originIndex1; index++) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const poppedTile = GlobalChartState.chartTiles[index].pop()!
			GlobalChartState.chartTiles[index + 1].splice(0, 0, poppedTile)
		}
		return
	}

	// Moving The album down

	// next place that in its new spot
	GlobalChartState.chartTiles[targetIndex1].splice(
		targetIndex2 + 1,
		0,
		movingTile
	)

	// now iteratively move through all arrays
	// popping the first one in the array and splicing it to the back of the previous array
	// until we see that we're in the array that it was originally moved from
	for (let index = targetIndex1; index > originIndex1; index--) {
		const poppedTile = GlobalChartState.chartTiles[index].splice(0, 1)[0]
		GlobalChartState.chartTiles[index - 1].splice(
			GlobalChartState.chartTiles[index - 1].length,
			0,
			poppedTile
		)
	}
}

let timer: ReturnType<typeof setTimeout>
const longPressTime = 500

export function onTouchStart(
	touchEvent: TouchEvent,
	album: AlbumSearchResult,
	source: 'Search' | 'Chart',
	originatingIndices?: IndicesObject,
	openDialog?: (indices?: IndicesObject) => void
) {
	if (typeof DragEvent !== 'function') {
		// If the HTML Drag and Drop API is supported
		// (all desktop browsers, and some latest mobile may support)
		return
	}

	function onHoldTouch() {
		// For hold touch to delete
		if (openDialog && originatingIndices && album.image !== GrayBoxImg) {
			openDialog(originatingIndices)
		}
	}

	timer = setTimeout(onHoldTouch, longPressTime)

	// console.log(1, touchEvent, album)
	const imgElement = touchEvent.target as HTMLImageElement

	// gets where you started the drag so that we can preserve that offset
	// and not snap the image when you start dragging
	const startingClickOffsetX =
		touchEvent.targetTouches[0].clientX -
		imgElement.getBoundingClientRect().left
	const startingClickOffsetY =
		touchEvent.targetTouches[0].clientY - imgElement.getBoundingClientRect().top

	const movingCopy = document.body.appendChild(
		imgElement.cloneNode(true)
	) as HTMLImageElement

	function moveImageToCursor(xPos: number, yPos: number) {
		movingCopy.style.left = `${xPos - startingClickOffsetX}px`
		movingCopy.style.top = `${yPos - startingClickOffsetY}px`
	}

	const boundingRect = imgElement.getBoundingClientRect()
	movingCopy.style.height = `${boundingRect.height.toString()}px`
	movingCopy.style.width = `${boundingRect.width.toString()}px`
	movingCopy.style.position = 'absolute'
	movingCopy.style.zIndex = '99'
	moveImageToCursor(
		touchEvent.targetTouches[0].clientX,
		touchEvent.targetTouches[0].clientY
	)

	function onTouchMove(touchEvent: TouchEvent) {
		if (timer) {
			clearTimeout(timer)
		}

		moveImageToCursor(
			touchEvent.targetTouches[0].clientX,
			touchEvent.targetTouches[0].clientY
		)
	}

	function onTouchEnd(touchEvent: TouchEvent) {
		// TODO:
		// do a swap instead of splice in if the drop target is a placeholder
		if (timer) {
			clearTimeout(timer)
		}

		movingCopy.remove()
		document.removeEventListener('touchmove', onTouchMove)
		document.removeEventListener('touchend', onTouchEnd)

		const elemBelow = document.elementFromPoint(
			touchEvent.changedTouches[0].clientX,
			touchEvent.changedTouches[0].clientY
		) as HTMLImageElement | null

		if (!elemBelow) {
			return
		}

		const firstIndex = elemBelow.getAttribute('firstindex')
		const secondIndex = elemBelow.getAttribute('secondindex')

		// if the attribute doesn't exist/ isn't a number it'll be NaN
		if (!firstIndex || !secondIndex) {
			return
		}

		if (source === 'Search') {
			if (!GlobalChartState) {
				return console.error(
					'Error getting GlobalChartState in onTouchEnd() type Search',
					GlobalChartState
				)
			}

			GlobalChartState.chartTiles[Number(firstIndex)].splice(
				Number(secondIndex),
				1,
				album
			)
			elemBelow.src = album.image
			elemBelow.alt = `${album.artist} - ${album.name}`
		} else if (source === 'Chart' && originatingIndices) {
			const targetIndices = {
				index1: Number(firstIndex),
				index2: Number(secondIndex)
			}
			// If in chart move the dragged element to the position you drop and push everything else back one
			RearrangeChart(
				targetIndices,
				originatingIndices,
				GlobalChartState.chartTiles[targetIndices.index1][targetIndices.index2]
					.image === GrayBoxImg
					? true
					: false
			)
		}
	}

	document.addEventListener('touchmove', onTouchMove)
	document.addEventListener('touchend', onTouchEnd)
}
