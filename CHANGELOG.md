# Changelog for musicchartmaker.com

## Future Version changes planned

- Features/ Enhancements
  - Have a way to have the top 100 album chart titles fit to the size of the chart
  - Improve accessibility
  - Improve UX
  - Shadow in chart
  - Have temporary storage of removed albums from resizing to refill
  - Show changelog in Site Info!
- Bug Fixes
  - Fix Last.fm!!
  - Add better guard rails to chart names
  - Add guard rails to custom presets

## Version 1.1.2 - June 28th, 2024

- Bug Fixes
  - Album search preview being cutoff
  - [Firefox] - Fix inability to edit album title and name
  
- Performance/ Stability
  - Migration from Tailwind -> UnoCSS
    - This was a lot of work, slightly changes how the site looks
    - includes a lot of small CSS tweaks and changes
    - Notably faster CSS compared to Tailwind
  - Updating all packages
    - except ESLint to 9 because it's a lot of tedious work
  
## Version 1.1.1 - June 5th, 2024

- Bug Fixes
  - Fix dynamic resizing deleting what people put inn
    - this means people can lose their progress by accident, which is annoying.
  - Some users are having issues with image being exported as `.jpeg` instead of `.jpg`
  - Low quality of image output, updated to have a quality slider
- Other Changes
  - default sorting of created charts changed from mirroring LocalStorage to Alphabetical
- Performance/ Stability
  - Updating all packages
    - except ESLint to 9 because it's a lot of tedious work

## Version 1.1.0 - May 5th, 2024

- Features/ Enhancements
  - Topsters 2 import
  - Move all Import and Export into a new card

## Version 1.0.1 - April 28th, 2024

- Bug Fixes
  - Lock editing of album text when you lock a chart
  - Fix styling issue inside Dialogs
- Performance/ Stability
  - Updating all packages
    - except ESLint to 9 because it's a lot of tedious work

## Version 1.0.0 - August 27th, 2023

- NO LONGER BETA
- Performance/ Stability
  - Many package updates
  - Many refactors
  - Last.fm no longer hits my server but runs in browser reducing latency
  - much more.

## Version Beta-0.9.5 - April 10th, 2023

- Performance - Added debouncing to watchers updating globalSiteOptions and chart

## Version Beta-0.9.4 - April 6th, 2023

- Feat - Added tooltip and updated placeholder for search input to inform user its searching via Last.fm & accepts image URL
- Feat - split out site specific options and chart options to exist separately
- Feat - tooltip on the new placeholder can be disabled, defaults to show to teach user
- Performance - Updated all images to be lazy loaded (in supporting browsers)
- Fix - Error originating from backgroundImage being set to `undefined`
- Fix - Error setting background if it wasn't already defined
- Fix - Some search results not being returned incorrectly (api side)

## Version Beta-0.9.3 - April 4th, 2023

- Feat - Adding a lock chart option
- Fix - Dialog-Polyfill was not injecting necessary CSS
- Fix - A lot of CSS fixes
- Change - Normalized button and input styling
- Dev - More and better error throwing
- Dev - Many import and TypeScript small changes
- Dev - fixed `prettier-plugin-tailwind` not actually being used and ran `format-fix` to format

## Version Beta-0.9.2 - March 24th, 2023

- Fix - various small CSS changes & fixes
- Dev - Many package updates and changes
- Optimization - Moved assets to static public folder

## Version Beta-0.9.1 - November 9th, 2022

- Fix - delete not always working properly for some reason?
- Fix - Search results coming back with gray image but not overlaying the name on top
- CSS - Fixed overflow on text overlay of image sometimes overflowing

## Version Beta-0.9.0 - November 1st, 2022

- Feat - Last.FM import functionality!

## Version Beta-0.8.1 - October 27th, 2022

- Fix - Changed touch and hold to be double tap so it works properly.
- Dev - Refactor of `New.vue`to make it easier to maintain

## Version Beta-0.8.0 - October 12th, 2022

- Feat - Added Custom Presets!
- Feat - Custom presets can be created, edited, and deleted
- UI - many small changes and added back buttons to replace close buttons
- Fix - A few small accessibility changes.

## Version Beta-0.7.7 - October 7th, 2022

- Bug - Fixed blur appearing when no results are shown
- Feat - Changed how scroll is indicated to user on mobile devices/ small screens

## Version Beta-0.7.6 - October 6th, 2022

- Bug - Fixed Save Image button capturing too much of the screen.
- Feat - Added blur to search results to indicate that it's scrollable without sacrificing width by having a scrollbar

## Version Beta-0.7.5 - October 5th, 2022

- Feat - Greatly enhanced tooltips w/ a new Tooltip component
- Feat - Yet more small CSS and other changes for better UI/UX
- Perf - Created more conditionals to reduce listeners and etc. on the placeholder boxes

---

## Version Beta-0.7.4 - October 4th, 2022

- Feat - Added hold to delete for touch devices
- Feat - various other small changes to CSS for touch
- Feat - finally disabled drag of the placeholder squares
- Feat - added swap if the drop target is the placeholder image
- Feat - lots of other small things to make charts be easier to work with on touch and desktop

---

## Version Beta-0.7.3 - October 3rd, 2022

- Feat - Even more changes to make the site be more responsive on mobile

---

## Version Beta-0.7.2 - October 3rd, 2022

- Feat - Even more changes to make the site be more responsive on mobile
- Dev - reverted postcss and tailwind configs to be `.cjs` as they still don't support ESM...

---

## Version Beta-0.7.1 - October 3rd, 2022

- Feat - Title's are now hidden by default for better mobile support and I see it far less, of course you can always still enable it per chart
- Feat - More changes to make the site work better on mobile!

---

## Version Beta-0.7.0 - October 2nd, 2022

- Feat - Many changes to make the site work better on mobile!
- Dev - Fixed vite failing to serve properly via config changes and module bumping

---

## Version Beta-0.6.1 - September 21st, 2022

- Perf - Cache valid fonts
- Fix - Chart adding not being set on creation of new chart.
- Fix - Removed ability to rename a chart to the name of a previously stored chart name
- Dev - break up of shared and storage files to not be so monolithic
- Dev - rewrote GlobalChartState and GlobalSiteOptions to reactive() because the ref() wrap was not necessary since they are objects

---

## Version Beta-0.6.0 - September 16th, 2022

- Feat - Chart Text: Font Selectors
- Feat - Chart Text: size and spacing sliders
- Feat - Chart Padding sliders
- Dev - Enhanced fetch() wrapper
- Dev - Condense Tailwind to have more custom classes to K.I.S.S
- Dev - Major refactor of Options component to not be a monolith

## Prior versions - Between May 31st, 2022 -> September 13th, 2022

- Didn't think of creating release notes at this point
