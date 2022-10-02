import { reactive, ref } from 'vue'
import type { ChartState, SiteOptions } from '#types'
import { GetSiteOptions, getStoredChart } from '#shared/storage'
import { GenerateDefaultChart } from '#shared/chart'
import { GenerateDefaultSiteOptions } from '#shared/misc'

// pull from storage or generate site options and chartstate
const storedOptions = GetSiteOptions()
const loadOptions = storedOptions ? storedOptions : GenerateDefaultSiteOptions()

const storedChart = getStoredChart(loadOptions.currentChart)
const loadChartState = storedChart ? storedChart : GenerateDefaultChart()

export const GlobalSiteOptions: SiteOptions = reactive(loadOptions)
export const GlobalChartState: ChartState = reactive(loadChartState)
export const StoredChartNames = ref([''])
