# Notes on *Kevin Whinnery's Workshop: Complete Node.js - From Zero to Production*

## 0. Setup and Running Locally

### Installing `Node` modules

```console
❯ npm install
```

### Installing and Starting `Postgres`

On a Mac, the easiest path to installing `Postgres` is [`Homebrew`](http://brew.sh/):

```console
❯ brew update
❯ brew install postgresql
```

Start `Postgres`:

```console
❯ pg_ctl -D /usr/local/var/postgres start
```

### Setting up the databases

Create the databases for the project and apply the migrations:

```console
❯ createdb todos
❯ createdb todos-test
❯ npm run migrate
```

### (Optional) Using `ElephantSQL` rather than a local `Postgres` DB

If `Postgres` is **not** installed locally, you can setup a free instance as follows:

  1. Visit [`ElephantSQL`](https://elephantsql.com).
  2. Login and setup a *free* tiny turtle instance.
  3. Goto *Details* and copy the `Postgres` url.

Create a `config/user.js` file and change the value of `config.database` accordingly:

``` js
'use strict'

let config = {}
config.databaseUrl = 'postgres://whatever:fromElephantSQLWeb'

module.exports = config;
```

Migrate the database:

``` console
❯ npm run migrate
```

### Running the application in development mode

```console
❯ NODE_ENV=development
❯ npm run grunt collect_static
❯ npm run grunt
```

### Running the application simulating production settings

```console
❯ NODE_ENV=production
❯ npm run grunt collect_static
❯ npm start
```


## 1. The `express` web server

### The most basic `express` server with `middleware`

`index.js`

``` js
const express = require('express')
const createUserMiddleware = require('./middleware')
const app = express()

app.use(createUserMiddleware('Dave'))

app.get('/hal', (req, res) =>
  res.send(`Just what do you think you are doing, ${req.user.name}?`)
)

app.listen(4000)
```

`middleware.js`

``` js
const createUser = username =>
  (req, res, next) => {
    req.user = { name: username }
    next()
  }
}

module.exports = createUser
```

#### Run it, Hit it, Get it

1. Run it with `❯ node index.js`.
2. Hit it at `http://localhost:4000/hal`.
3. Get `Just what do you think you are doing, Dave?`.
