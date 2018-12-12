module.exports = {
  // Indent lines with tabs
  "prettier.useTabs": false,
  // Fit code within this line limit
  "prettier.printWidth": 80,
  // Number of spaces it should use per tab
  "prettier.tabWidth": 2,
  // If true, will use single instead of double quotes
  "prettier.singleQuote": false,
  // Controls the printing of trailing commas wherever possible. Valid options:
  // "none" - No trailing commas
  // "es5"  - Trailing commas where valid in ES5 (objects, arrays, etc)
  // "all"  - Trailing commas wherever possible (function arguments)
  "prettier.trailingComma": "none",
  // If true, puts the `>` of a multi-line jsx element at the end of
  // the last line instead of being alone on the next line
  "prettier.jsxBracketSameLine": false,
  // Which parser to use. Valid options are 'flow' and 'babylon'
  "prettier.parser": "babylon",
  // Whether to add a semicolon at the end of every line (semi: true),
  // or only at the beginning of lines that may introduce ASI failures (semi: false)
  "prettier.semi": true
};