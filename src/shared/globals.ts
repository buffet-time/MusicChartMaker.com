import { ref, type Ref } from 'vue'
import type { ChartState, SiteOptions } from '#types'
import { GetSiteOptions, getStoredChart } from '#shared/storage'
import { GenerateDefaultChart } from '#shared/chart'
import { GenerateDefaultSiteOptions } from '#shared/misc'

// pull from storage or generate site options and chartstate
const storedOptions = GetSiteOptions()
const loadOptions = storedOptions ? storedOptions : GenerateDefaultSiteOptions()

const storedChart = getStoredChart(loadOptions.currentChart)
const loadChartState = storedChart ? storedChart : GenerateDefaultChart()

// Changed back to ref() from reactive() for more proper value changing
export const GlobalSiteOptions: Ref<SiteOptions> = ref(loadOptions)
export const GlobalChartState: Ref<ChartState> = ref(loadChartState)
export const StoredChartNames = ref([''])
