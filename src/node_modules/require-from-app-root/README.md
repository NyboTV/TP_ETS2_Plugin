# require-from-app-root

Requires files from the app root.

## Installation

```sh
npm install require-from-app-root --save
```

## Usage

```
import {requireFromAppRoot} from 'require-from-app-root';

// Requires the name from package.json file of the app root directory
const name = requireFromAppRoot('package.json').name;
```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [@types/node](https://www.github.com/DefinitelyTyped/DefinitelyTyped.git): TypeScript definitions for Node.js
- [app-root-dir](https://github.com/philidem/node-app-root-dir): Simple module to infer the root directory of the currently running node application

## Dev Dependencies

- [rimraf](): A deep deletion module for node (like `rm -rf`)
- [tslint](https://github.com/palantir/tslint): An extensible static analysis linter for the TypeScript language
- [typescript](https://github.com/Microsoft/TypeScript): TypeScript is a language for application scale JavaScript development


## License

MIT
