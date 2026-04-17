import type { TopAlbumsResult } from '#lastfm/types'

export interface DragDataTransfer {
	albumObject?: AlbumSearchResult
	mediaObject?: MovieAndTvSearchResult
	dragSource: 'Search' | 'Chart'
	originatingIndices: IndicesObject
}

export interface IndicesObject {
	index1: number
	index2: number
}

export type SearchTypes = 'album' | 'media'

export type SearchResults =
	| { type: 'media'; results: MovieAndTvSearchResult[] }
	| { type: 'album'; results: AlbumSearchResult[] }

export type SearchResult =
	| { type: 'media'; result: MovieAndTvSearchResult }
	| { type: 'album'; result: AlbumSearchResult }

export interface MovieAndTvSearchResult {
	image: string
	title: string
	year: string
}

export interface AlbumSearchResult {
	image: string
	name: string
	artist: string
}

export interface ChartPreset {
	presetName?: string
	default: boolean
	rowSizes: number[]
}

export interface ChartOptions {
	// not changing property name for backwards compat
	// but the name was naive on my part
	chartSize: ChartPreset
	chartTitle: string
	displayTitles: boolean
	displayNumberRank: boolean
	background: string
	textColor: string
	font?: string
	padding?: number
	backgroundImage?: string
	preset?: boolean
	fontSize?: number
	textSpacing?: number
	lockChart?: boolean
	textShadow?: string
	constrainTitles?: boolean
	constrainTitlesCentered?: boolean
	mediaType?: SearchTypes
}

export type OrderOptions =
	| 'Ascending'
	| 'Descending'
	| 'Most Characters'
	| 'Least Characters'

export interface SiteOptions {
	numberOfSearchResults: number
	currentChart: string
	fontCache?: string[]
	presets?: ChartPreset[]
	hideTooltip?: boolean
	chartTitleSortingMethod?: OrderOptions
}

export interface ChartState {
	options: ChartOptions
	// I genuinely have no idea why I decided making this a matrix when it could have been single dimensional array :/
	chartTiles: AlbumSearchResult[][] | MovieAndTvSearchResult[][]
}

export type LastfmPeriod =
	| 'overall'
	| '7day'
	| '1month'
	| '3month'
	| '6month'
	| '12month'

export type ChartType = 'Dynamic' | 'Preset'

export type JSONReturnType =
	| string
	| number
	| boolean
	| { [x: string]: JSONReturnType }
	| JSONReturnType[]
	| null
	| AlbumSearchResult[]
	| MovieAndTvSearchResult[]
	| TopAlbumsResult[]
