import { ref, type Ref } from 'vue'
import type { ChartState, SiteOptions } from '#types'
import { GetSiteOptions, getStoredChart } from '#shared/storage'
import { GenerateDefaultChart } from '#shared/chart'
import { GenerateDefaultSiteOptions } from '#shared/misc'

// TODO: look into adding Pinia for state management

// pull from storage or generate site options and chartstate
const storedOptions = GetSiteOptions()
const loadOptions = storedOptions ? storedOptions : GenerateDefaultSiteOptions()

const storedChart = getStoredChart(loadOptions.currentChart)
const loadChartState = storedChart ? storedChart : GenerateDefaultChart()

export const GlobalSiteOptions: Ref<SiteOptions> = ref(loadOptions)
export const GlobalChartState: Ref<ChartState> = ref(loadChartState)
export const StoredChartNames = ref([''])
export const selectedChartTitle = ref('')
