#!/bin/zsh

tsc daily-generator.ts && node daily-generator.js 2023-03-03 2023-03-07

#tsc weekly-generator.ts && node weekly-generator.js 2023-03-03 2023-03-07

#mv 2023*.md ../../temp/Logseq/journals   # move to logseq journals folder
