# Orbiter

[![CircleCI](https://circleci.com/gh/Lunyr/Orbiter/tree/master.svg?style=svg&circle-token=3b4d992ec4996123226a816aaba2b7da60bce6ea)](https://circleci.com/gh/Lunyr/Orbiter/tree/master)

A decentralized Lunyr electron application

**This is experimental software. There are known issues, missing functionality, and some components
may not work.** There will be continuous work on Orbiter going forward.

## Download

| Release | IPFS Hash | | -------------------------------- +
------------------------------------------------- | | 0.0.2 - Linux x86-64 (AppImage) |
[QmPm3dzLze3BeBqXvAv8TsGT6WXJy7Ta27pAXnTHooujav](https://ipfs.io/ipfs/QmPm3dzLze3BeBqXvAv8TsGT6WXJy7Ta27pAXnTHooujav)
| | 0.0.2 - Linux x86-64 (deb) |
[QmP44uLACUrhwRQbpvDAGe19PQpsHtcSdec5gpjKRvHtm3](https://ipfs.io/ipfs/QmP44uLACUrhwRQbpvDAGe19PQpsHtcSdec5gpjKRvHtm3)
| | 0.0.2 - Windows Universal |
[Qmdc4cUdUuSABkdwi6Xh3w9EdAHvNZxzN23AQzFNqNrRod](https://ipfs.io/ipfs/Qmdc4cUdUuSABkdwi6Xh3w9EdAHvNZxzN23AQzFNqNrRod)
| | 0.0.2 - OSX x86-64 | - |

## Development

```bash
yarn install && yarn start
```

## DevTools

Toggle DevTools:

- OSX: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

## Packaging

**NOTE**: Python will need to be installed on the machine used for packaging and development for
node-gyp.

Modify [electron-builder.yml](./electron-builder.yml) to edit package info.

For a full list of options see: https://www.electron.build/configuration/configuration

Create a package for OSX, Windows and Linux

```
yarn package
```

Or target a specific platform

```
yarn package-win
yarn package-linux
```

## Tests

```
yarn test
```
