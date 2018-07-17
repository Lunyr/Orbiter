# Orbiter

A decentralized Lunyr electron application 

## Development

```bash
yarn install && yarn start
```

## DevTools

Toggle DevTools:

* OSX: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
* Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
* Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

## Packaging

Modify [electron-builder.yml](./electron-builder.yml) to edit package info.

For a full list of options see: https://www.electron.build/configuration/configuration

Create a package for OSX, Windows and Linux
```
yarn pack
```

Or target a specific platform
```
yarn pack:mac
yarn pack:win
yarn pack:linux
```

## Tests

```
yarn test
```
