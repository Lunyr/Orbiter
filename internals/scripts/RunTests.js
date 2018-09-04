import spawn from 'cross-spawn';
import path from 'path';

const result = spawn.sync(
  path.normalize('./node_modules/.bin/electron-mocha --renderer -R spec --require babel-core/register --require test/mocha.env.js'),
  [pattern, ...process.argv.slice(2)],
  { stdio: 'inherit' }
);

process.exit(result.status);
