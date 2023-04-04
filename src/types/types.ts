export interface DragDataTransfer {
	albumObject: AlbumSearchResult
	dragSource: 'Search' | 'Chart'
	originatingIndices: IndicesObject
}

export interface IndicesObject {
	index1: number
	index2: number
}

export interface AlbumSearchResult {
	image: string
	name: string
	artist: string
}

export interface AlbumTile extends AlbumSearchResult {
	timesPlayed?: string
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
	displayPlaycount: boolean
	background: string
	textColor: string
	font?: string
	padding?: number
	backgroundImage?: string
	textBorderColor?: string
	preset?: boolean
	fontSize?: number
	textSpacing?: number
	lockChart?: boolean
}

export interface SiteOptions {
	numberOfSearchResults: number
	currentChart: string
	fontCache?: string[]
	presets?: ChartPreset[]
}

export interface ChartState {
	options: ChartOptions
	chartTiles: AlbumTile[][]
}

export type LastfmPeriod =
	| 'overall'
	| '7day'
	| '1month'
	| '3month'
	| '6month'
	| '12month'

export type ChartType = 'Dynamic' | 'Preset'
