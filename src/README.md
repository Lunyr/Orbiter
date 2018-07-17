# Overview

### `assets`

A folder that contains our locally used assets like images, videos, locales, etc

### `backend`

A folder that contains our applications local API and backend that integrates with the blockchain

### `main`

A folder that contains the core entry point into the electron application.

The single main process that spawns based on the property `main` within the package.json.

### `renderer`

A folder that contains the entire client application. The entry point for the application is
`index.html` which injects the script `root.js` which loads the root app component into the DOM.
