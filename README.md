# Copy Paste Detector

This npm package analyzes JavaScript files to detect duplicated functions and variables, generating a report in JSON format.

## Installation

To use this package, install it globally or locally in your project:

```bash
npm install copy-paste-detector
```

Usage
You can run the package via npm script with optional parameters:

bash
```
npm run copy-paste-detector [scripts-path]
```
[scripts-path] (optional): Path to the directory containing JavaScript files to analyze. Defaults to scripts directory.

## Example
```
npm run detect my-scripts-folder
```

This will analyze JavaScript files in my-scripts-folder and generate a copy-paste-detector-results.json file in the current directory.

## Output
The package outputs a JSON file (copy-paste-detector-results.json) containing details of duplicated functions and variables found in the analyzed JavaScript files.

Output Example ( copy-paste-detector-results.json )
```
[
  {
    "name": "tester",
    "count": 2,
    "type": "function",
    "occurrences": [
      {
        "line": 757,
        "filePath": "C:\\Users\\cengiz.ilhan\\Desktop\\spagetti detector\\scripts\\functions.js"
      },
      {
        "line": 374,
        "filePath": "C:\\Users\\cengiz.ilhan\\Desktop\\spagetti detector\\scripts\\yazarlar-app.js"
      }
    ]
  }
]
```

https://github.com/cengizilhan/copy-paste-detector-js

https://github.com/cengizilhan/


