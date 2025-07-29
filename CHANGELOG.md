# Changelog for musicchartmaker.com

## Future Version changes planned

- Features/ Enhancements
  - Investigate having folder structure for selected charts.
  - Add Import from Topsters 3 (topsters.org)
  - Add Games charts
  - Add books Charts
  - Add movies/ TV charts
  - Define a strict browser support w/ Browserlist & make that available to end users.
  - Create a version of the popover that uses the new native component
  - Add user site level customizations

---

## Planned changes for the next version, subject to change

- Add Import from Topchart (topchart.amanharwara.com)

---

## Version 1.5.0 - July 29, 2025

- Features/ Enhancements
  - Created new Core Component Toast to have much prettier information being shown to the user

- Dev
  - Added Knip command to use to keep the project clean
  - Added command for Bundle Analysis
    - This was used to decide not to use `buefy` due to it's large bundle size even for a single component.

---

## Version 1.4.0 - July 19th, 2025

- Features/ Enhancements
  - Imports and Exports!
    - Add single chart export/ import
    - Add all chart export/ import (without site options)
    - Add site options export/ import (by itself)
  - UI/ UX improvements
    - Updated Import/ Export section
    - Added visual indication of Image Save working
- Performance/ Stability/ Dev
  - Updated all packages
    - Moved to using rolldown-vite for better builds
  - Major refactoring work
  - Setup Vitest, will expand on the current coverage on only 3 files later

---

## Version 1.3.2 - July 7th, 2025

- Enhancements
  - Many, many Accessibility fixes
  - Many, many UI/UX fixes/ tweaks
- Dev
  - Extracted multiple repeated blocks into their own components
  - Marked more areas for improvement, cleaned up comments
  - General cleanup

---

## Version 1.3.1 - July 5th, 2025

- Bug Fixes
  - Fixed issue where the charts wouldn't be sorted in anyway if you did not set manually a value in Site Options for sort order.
- Dev
  - Added new Dev Tool to help test this and other bugs.

---

## Version 1.3.0 - July 4th, 2025

- Features
  - Click search result album to add it top-most empty chart tile.
  - Add order options for charts
    - Ascending
    - Descending
    - Most Characters
    - Least Characters
- Performance/ Stability/ Dev
  - Updated all packages
  - Cleaned up dangling biome comments
  - Moved to using Vite-Rolldown preview
  - other small dev-y changes.

---

## Version 1.2.4 - June 27th, 2025

- Misc
  - Added a note that there is no Transformers/ LLM usage ("AI") at all in the creation of this website
  - updated README.MD
- Bug Fixes
  - Fixed bug which allowed the viewing, creation, editing, and deletion of 4 invalid chart names.
  - Attempted fix at flakiness of auto-resizing of titles
- Performance/ Stability
  - Updated all packages
  - Migrated Linter from Biome -> to OXC
  - Migrated Formatter from Biome -> Prettier w/ OXC for speed.

---

## Version 1.2.3 - October 3rd, 2024

- Bug Fixes
  - Hopefully fixed some Topsters2 imports not working
- Performance/ Stability
  - Updated all packages
  - Audited the bundle and made small changes

---

## Version 1.2.2 - September 30th, 2024

- Performance/ Stability
  - Code Splitting
    - Popper.js
  - Updated all packages
    - Includes upgrade from Vue 3.4.x -> 3.5.x
  - Migrated from ESLint + Prettier -> Biome
    - major Developer experience improvement for myself.

---

## Version 1.2.1 - July 23rd, 2024

- Features/ Enhancements
  - Have temporary storage of removed albums from resizing to refill
    - accidentally resize? np they're still there!
- Bug Fixes
  - Fixed incorrect non-null assertion
- Performance/ Stability
  - Updated all packages

---

## Version 1.2.0 - July 14th, 2024

- Features/ Enhancements
  - The text now fits properly and on one line next to the chart no matter the size
    - Removed FontSize option, as this is now algorithmically determined.
  - Shadow in chart
    - Removed Text Outline Option as this uses the underlying tech, but gives you more fine grain control.
- Bug Fixes
  - Fixed Last.fm chart creation
    - I have no idea what i was doing with the original version, that was dogshit code.
    - Also cleaned up other Last.fm code.
  - Fixed Show Album Titles toggle
  - Fixed Save Image saving the space where Titles are, even if the titles aren't shown
  - Fixed last.fm/ other album images failed to load where it shows the title in the chart overflowing if text is too large
- Performance/ Stability
  - Updated all packages
  - Updated GitHub CI actions

---

## Version 1.1.3 - July 2nd, 2024

- Features/ Enhancements
  - Flush out old images when a new search happens to prevent bugginess
    - On every instance of search tear down the component and rebuild
  - Show changelog in Site Info!
    - Renders the CHANGELOG.MD into Site Info
- Bug Fixes
  - Add guard rails to custom presets
- Performance/ Stability
  - Code Splitting
    - Dynamic Import Pako
    - Dynamic Import Marked
  - Updated all packages
    - Finally upgraded to ESlint 9
  - Set Rollup to use SWC for minification
    - SWC Minify is the currently best Minifier
- Other
  - Added an example Topsters2 Export to the repo as I don't have it stored off-site anywhere

---

## Version 1.1.2 - June 29th, 2024

- Bug Fixes
  - Album search preview being cutoff
  - [Firefox] - Fix inability to edit album title and name
- Performance/ Stability
  - Migration from Tailwind -> UnoCSS
    - This was a lot of work, slightly changes how the site looks
    - includes a lot of small CSS tweaks and changes
    - Notably faster CSS compared to Tailwind
  - Updated all packages
    - except ESLint to 9 because it's a lot of tedious work

---

## Version 1.1.1 - June 5th, 2024

- Bug Fixes
  - Fix dynamic resizing deleting what people put inn
    - this means people can lose their progress by accident, which is annoying.
  - Some users are having issues with image being exported as `.jpeg` instead of `.jpg`
  - Low quality of image output, updated to have a quality slider
- Other Changes
  - default sorting of created charts changed from mirroring LocalStorage to Alphabetical
- Performance/ Stability
  - Updated all packages
    - except ESLint to 9 because it's a lot of tedious work

---

## Version 1.1.0 - May 5th, 2024

- Features/ Enhancements
  - Topsters 2 import
  - Move all Import and Export into a new card

---

## Version 1.0.1 - April 28th, 2024

- Bug Fixes
  - Lock editing of album text when you lock a chart
  - Fix styling issue inside Dialogs
- Performance/ Stability
  - Updated all packages
    - except ESLint to 9 because it's a lot of tedious work

---

## Version 1.0.0 - August 27th, 2023

- NO LONGER BETA
- Performance/ Stability
  - Many package updates
  - Many refactors
  - Last.fm no longer hits my server but runs in browser reducing latency
  - much more.

---

## Version Beta-0.9.5 - April 10th, 2023

- Performance - Added debouncing to watchers updating globalSiteOptions and chart

---

## Version Beta-0.9.4 - April 6th, 2023

- Feat - Added tooltip and updated placeholder for search input to inform user its searching via Last.fm & accepts image URL
- Feat - split out site specific options and chart options to exist separately
- Feat - tooltip on the new placeholder can be disabled, defaults to show to teach user
- Performance - Updated all images to be lazy loaded (in supporting browsers)
- Fix - Error originating from backgroundImage being set to `undefined`
- Fix - Error setting background if it wasn't already defined
- Fix - Some search results not being returned incorrectly (api side)

---

## Version Beta-0.9.3 - April 4th, 2023

- Feat - Adding a lock chart option
- Fix - Dialog-Polyfill was not injecting necessary CSS
- Fix - A lot of CSS fixes
- Change - Normalized button and input styling
- Dev - More and better error throwing
- Dev - Many import and TypeScript small changes
- Dev - fixed `prettier-plugin-tailwind` not actually being used and ran `format-fix` to format

---

## Version Beta-0.9.2 - March 24th, 2023

- Fix - various small CSS changes & fixes
- Dev - Many package updates and changes
- Optimization - Moved assets to static public folder

---

## Version Beta-0.9.1 - November 9th, 2022

- Fix - delete not always working properly for some reason?
- Fix - Search results coming back with gray image but not overlaying the name on top
- CSS - Fixed overflow on text overlay of image sometimes overflowing

---

## Version Beta-0.9.0 - November 1st, 2022

- Feat - Last.FM import functionality!

---

## Version Beta-0.8.1 - October 27th, 2022

- Fix - Changed touch and hold to be double tap so it works properly.
- Dev - Refactor of `New.vue`to make it easier to maintain

---

## Version Beta-0.8.0 - October 12th, 2022

- Feat - Added Custom Presets!
- Feat - Custom presets can be created, edited, and deleted
- UI - many small changes and added back buttons to replace close buttons
- Fix - A few small accessibility changes.

---

## Version Beta-0.7.7 - October 7th, 2022

- Bug - Fixed blur appearing when no results are shown
- Feat - Changed how scroll is indicated to user on mobile devices/ small screens

---

## Version Beta-0.7.6 - October 6th, 2022

- Bug - Fixed Save Image button capturing too much of the screen.
- Feat - Added blur to search results to indicate that it's scrollable without sacrificing width by having a scrollbar

---

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

---

## Prior versions - Between May 31st, 2022 -> September 13th, 2022

- Didn't think of creating release notes at this point
