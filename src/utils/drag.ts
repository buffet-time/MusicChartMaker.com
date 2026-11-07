import type {
	AlbumSearchResult,
	DragDataTransfer,
	IndicesObject,
	MovieAndTvSearchResult,
	SearchResult,
} from '#types'
import { GlobalChartState } from '#utils/globals'
import { getMediaNameWithoutNumber } from './chart'
import { GrayBoxImgForPlaceholderForMusic } from './misc'

const DOUBLE_TAP_TIME = 300
export const dragDialogId = 'DragLongHoldId'

export function DragSetData(
	dragEvent: DragEvent,
	objectToTransfer: DragDataTransfer,
) {
	if (!dragEvent.dataTransfer) {
		return console.error(
			'error in DragSetData(): ',
			dragEvent,
			objectToTransfer,
		)
	}

	dragEvent.dataTransfer.setData('text/plain', JSON.stringify(objectToTransfer))
}

export function RearrangeChart(
	{ index1: targetIndex1, index2: targetIndex2 }: IndicesObject,
	{ index1: originIndex1, index2: originIndex2 }: IndicesObject,
	swap?: boolean,
) {
	if (!GlobalChartState) {
		return console.error(
			'Error getting GlobalChartState in RearrangeChart()',
			GlobalChartState,
		)
	}

	// Swap the 2 elements
	if (swap) {
		const targetTile =
			GlobalChartState.value.chartTiles[targetIndex1][targetIndex2]
		GlobalChartState.value.chartTiles[targetIndex1][targetIndex2] =
			GlobalChartState.value.chartTiles[originIndex1][originIndex2]
		GlobalChartState.value.chartTiles[originIndex1][originIndex2] = targetTile
		return
	}

	if (targetIndex1 === originIndex1) {
		// they're in the same array (read row) so it's simple and 1 dimensional
		const tile = GlobalChartState.value.chartTiles[originIndex1].splice(
			originIndex2,
			1,
		)[0]
		GlobalChartState.value.chartTiles[targetIndex1].splice(
			targetIndex2,
			0,
			// @ts-expect-error - this is fine.
			tile,
		)
		return
	}
	// have to do more complex stuff here because its moving 2 dimensionally\

	// First splice out the tile we're moving
	const movingTile = GlobalChartState.value.chartTiles[originIndex1].splice(
		originIndex2,
		1,
	)[0]

	// Moving The album up
	if (targetIndex1 < originIndex1) {
		// next place that in its new spot
		GlobalChartState.value.chartTiles[targetIndex1].splice(
			targetIndex2,
			0,
			// @ts-expect-error - this is fine.
			movingTile,
		)

		// now iteratively move through all arrays
		// popping the last one in the array and splicing it to the front of the next array
		// until we see that we're in the array that it was originally moved from
		for (let index = targetIndex1; index < originIndex1; index += 1) {
			const poppedTile = GlobalChartState.value.chartTiles[index].pop()

			if (!poppedTile) {
				return console.error('Error popping tile: ', GlobalChartState.value)
			}

			// @ts-expect-error - this is fine.
			GlobalChartState.value.chartTiles[index + 1].splice(0, 0, poppedTile)
		}
		return
	}

	// Moving The album down

	// next place that in its new spot
	GlobalChartState.value.chartTiles[targetIndex1].splice(
		targetIndex2 + 1,
		0,
		// @ts-expect-error - this is fine.
		movingTile,
	)

	// now iteratively move through all arrays
	// popping the first one in the array and splicing it to the back of the previous array
	// until we see that we're in the array that it was originally moved from
	for (let index = targetIndex1; index > originIndex1; index -= 1) {
		const poppedTile = GlobalChartState.value.chartTiles[index].splice(0, 1)[0]
		GlobalChartState.value.chartTiles[index - 1].splice(
			GlobalChartState.value.chartTiles[index - 1].length,
			0,
			// @ts-expect-error - this is fine.
			poppedTile,
		)
	}
}

let myLatestTap = 0
export function onTouchStart({
	touchEvent,
	album,
	media,
	source,
	openDialog,
	originatingIndices,
}: {
	touchEvent: TouchEvent
	album?: AlbumSearchResult
	media?: MovieAndTvSearchResult
	source: 'Search' | 'Chart'
	originatingIndices?: IndicesObject
	openDialog?: (indices?: IndicesObject) => void
}) {
	if (typeof DragEvent !== 'function') {
		// If the HTML Drag and Drop API is supported
		// (all desktop browsers, and some latest mobile may support)
		return
	}

	// Used for detecting doubletap
	const now = new Date().getTime()
	const timeSince = now - myLatestTap
	if (
		timeSince < DOUBLE_TAP_TIME &&
		timeSince > 0 &&
		openDialog &&
		originatingIndices
	) {
		openDialog(originatingIndices)
		return
	}
	myLatestTap = new Date().getTime()

	const imgElement = touchEvent.target as HTMLImageElement

	// gets where you started the drag so that we can preserve that offset
	// and not snap the image when you start dragging
	const startingClickOffsetX =
		touchEvent.targetTouches[0].clientX -
		imgElement.getBoundingClientRect().left
	const startingClickOffsetY =
		touchEvent.targetTouches[0].clientY - imgElement.getBoundingClientRect().top

	const movingCopy = document.body.appendChild(
		imgElement.cloneNode(true),
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
		touchEvent.targetTouches[0].clientY,
	)

	function onTouchMove(onTouchMoveEvent: TouchEvent) {
		moveImageToCursor(
			onTouchMoveEvent.targetTouches[0].clientX,
			onTouchMoveEvent.targetTouches[0].clientY,
		)
	}

	function onTouchEnd(onTouchEndEvent: TouchEvent) {
		movingCopy.remove()
		document.removeEventListener('touchmove', onTouchMove)
		document.removeEventListener('touchend', onTouchEnd)

		const elementBelow = document.elementFromPoint(
			onTouchEndEvent.changedTouches[0].clientX,
			onTouchEndEvent.changedTouches[0].clientY,
		) as HTMLImageElement | null

		if (!elementBelow) {
			return
		}

		const firstIndex = elementBelow.getAttribute('firstindex')
		const secondIndex = elementBelow.getAttribute('secondindex')

		// if the attribute doesn't exist/ isn't a number it'll be NaN
		if (!firstIndex || !secondIndex) {
			return
		}

		if (source === 'Search') {
			if (!GlobalChartState) {
				return console.error(
					'Error getting GlobalChartState in onTouchEnd() type Search',
					GlobalChartState,
				)
			}

			if (album) {
				GlobalChartState.value.chartTiles[Number(firstIndex)].splice(
					Number(secondIndex),
					1,
					album,
				)
				elementBelow.src = album.image
				elementBelow.alt = `${album.artist} - ${album.name}`
			} else if (media) {
				GlobalChartState.value.chartTiles[Number(firstIndex)].splice(
					Number(secondIndex),
					1,
					media,
				)
				elementBelow.src = media.image
				elementBelow.alt = `${media.title} (${media.year})`
			}
		} else if (source === 'Chart' && originatingIndices) {
			const targetIndices = {
				index1: Number(firstIndex),
				index2: Number(secondIndex),
			}
			// If in chart move the dragged element to the position you drop and push everything else back one
			RearrangeChart(
				targetIndices,
				originatingIndices,
				GlobalChartState.value.chartTiles[targetIndices.index1][
					targetIndices.index2
				].image === GrayBoxImgForPlaceholderForMusic,
			)
		}
	}

	document.addEventListener('touchmove', onTouchMove)
	document.addEventListener('touchend', onTouchEnd)
}

export function onDragStart(dragEvent: DragEvent, search: SearchResult) {
	DragSetData(dragEvent, {
		// oxlint-disable-next-line no-undefined
		albumObject: search.type === 'album' ? search.result : undefined,
		// oxlint-disable-next-line no-undefined
		mediaObject: search.type === 'media' ? search.result : undefined,
		dragSource: 'Search',
		originatingIndices: { index1: 0, index2: 0 },
	})

	if (!dragEvent.dataTransfer) {
		// oxlint-disable-next-line no-console
		return console.error('Error in onDragStart(): ', dragEvent, search)
	}

	dragEvent.dataTransfer.dropEffect = 'copy'
}

export function onDrop(
	dragEvent: DragEvent,
	{ index1, index2 }: IndicesObject,
) {
	const data = dragEvent.dataTransfer?.getData('text/plain')

	if (!data) {
		return console.error('onDrop() failed: ', dragEvent, index1, index2, data)
	}

	const mediaDraggedIn = JSON.parse(data) as DragDataTransfer

	if (mediaDraggedIn.dragSource === 'Chart') {
		// If in chart move the dragged element to the position you drop and push everything else back one
		return RearrangeChart(
			{ index1, index2 },
			mediaDraggedIn.originatingIndices,
			GlobalChartState.value.chartTiles[index1][index2].image ===
				GrayBoxImgForPlaceholderForMusic,
		)
	}

	// from search replace current dropped
	const currentElement = dragEvent.currentTarget as HTMLImageElement

	const mediaObject = mediaDraggedIn?.albumObject
		? mediaDraggedIn.albumObject
		: // oxlint-disable-next-line typescript/no-non-null-assertion
			mediaDraggedIn.mediaObject!

	GlobalChartState.value.chartTiles[index1].splice(
		index2,
		1,
		// @ts-expect-error - it is only one or the other.
		mediaDraggedIn.albumObject
			? mediaDraggedIn.albumObject
			: mediaDraggedIn.mediaObject,
	)
	currentElement.src = mediaObject.image
	currentElement.alt = getMediaNameWithoutNumber(mediaObject)
}
