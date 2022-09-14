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

export interface ChartSize {
	rowSizes: number[]
	numberOfRows: number
	numberOfTiles: number
}

export interface ChartOptions {
	chartSize: ChartSize // number of tiles
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
	preset?: Preset
	fontSize?: number
	textSpacing?: number
}

export type Preset = 'Top 42' | 'Top 100'

export interface SiteOptions {
	numberOfSearchResults: number
	currentChart: string
}

export interface ChartState {
	options: ChartOptions
	chartTiles: AlbumTile[][]
}
