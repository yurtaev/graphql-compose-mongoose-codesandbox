- `index.js` init apollo-server
- `mongoServer.js` init mongod and load fixtures
- `schema.js` graphql-compose-mongoose schema

## Environment

- uses node 14 + NODE_OPTIONS="--experimental-top-level-await"
- ESM modules
- `mongodb-memory-server-global-3.6` – mongod version of 3.6 to fix `CURL_OPENSSL_3.*not found`
