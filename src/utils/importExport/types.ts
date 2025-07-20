import { ChartState, SiteOptions } from '#types'

export type ImportExportTypes =
	| 'Everything'
	| 'All Charts'
	| 'Site Config'
	| 'Single Chart'

export interface FileStructure {
	chartData?: ChartState[]
	siteData?: SiteOptions | null
	exportType?: ImportExportTypes
}
