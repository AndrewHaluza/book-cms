## Installation

```bash
#! /bin/bash

# install dependencies, obviously
$ npm install
# copy initial .env
# MANDATORY ADJUST: `SQL_*`, `REDIS_*`, `DYNAMODB_*` variables
$ cp example.env ./.env
```

**Tested with versions**

| Component |     Version      | Tested On |
| :-------: | :--------------: | :-------: |
|  NodeJS   |     v20.14.0     | May 2025  |
|    npm    |      10.7.0      | May 2025  |
| postgres  | 16.3-1.pgdg120+1 | May 2025  |
|   redis   |      7.0.5       | May 2025  |

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Documentation

http://localhost:3000/api - REST Swagger Docs

http://localhost:3000/graphql - Graphql Playground

## License

Nest is [MIT licensed](LICENSE).
