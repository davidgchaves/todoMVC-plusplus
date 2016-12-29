# Notes on *Kevin Whinnery's Workshop: Complete Node.js - From Zero to Production*

## 0. Setup and Running Locally

### Links

- [TodoMVC++ Github Repo](https://github.com/kwhinnery/todomvc-plusplus): TodoMVC++ is the companion application for Zero to Production with Node.
- [The Elastic Beanstalk Command Line Interface (EB CLI)](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html): Command line interface for Elastic Beanstalk.
- [ngrok](https://ngrok.com/): Secure tunnels to localhost.
- [Locust](http://locust.io/): An open source load testing tool.
- [Rollbar](https://rollbar.com/): Error tracking Service for the Server side.
- [TrackJS](https://trackjs.com/): Error tracking on the Client side.
- [Google Analytics](https://www.google.com/analytics/)
- [universal-analytics](https://www.npmjs.com/package/universal-analytics): A node module for Google's Universal Analytics tracking.

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

module.exports = config
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

module.exports = createUser
```

#### Run it, Hit it, Get it

1. Run it with `❯ node index.js`.
2. Hit it at `http://localhost:4000/hal`.
3. Get `Just what do you think you are doing, Dave?`.


## 2. Production Environment

### Lingo

EB -> Elastic BeanStalk.
RDS -> Relational Database Service.

### Deploy a Node App on AWS

One possible pipeline to get a Node App deployed on AWS using:

- EB:
  - Elastic Load Balancer.
  - EB Environment.
  - Provisions EC2 instances within an AutoScaled Group.
- RDS database on the backend.

### Provisioning an EB Environment

1. Select an AWS Region.
2. Create a user with sufficient permissions.
3. Create an EB environment (will be added to a security group).
  - Fully functional execution environment for your App.
  - Typically you'll have multiple environments:
    - Development
    - Staging
    - Production
4. Create an RDS instance (add to same EB security group).
  - Our EB environment instances can connect to our RDS instance.
  - The outside world can't directly connect to out RDS instance.
5. Configure security group to allow incoming connections to Postgres.
6. Deploy application version.

### The Elastic Beanstalk Command Line Interface (EB CLI)

``` console
❯ brew install aws-elasticbeanstalk
```

### `eb` workflow

``` console
❯ eb init
❯ eb create
❯ eb deploy
```

#### Where to store the DB Connection String?

- If you configure your RDS instance to **NOT** accept traffic from the outside, then it's not the end of the world to have the DB Connection String as an Environment Variable (accessible through the console UI).
- But there's an ever better way to store secure credentials in a S3 bucket (in an XML or JSON file) and then load them into the system environment (not accessible through the console UI).

## 3. Preparing our Application for production

### Installing Locust

Install libevent (dependency for gevent):

``` console
❯ brew install libevent
```

Install locust:

``` console
❯ pip install locustio
```

### Configuring Locust

Locust opens a new file per new simutaled user, when testing.
  - 1000 opened files means 1000 concurrent users.

Raise the number of open files to 1000, in the context of the current terminal session:

``` console
❯ ulimit -n 1000
```

### Installing Rollbar

``` console
❯ npm install --save rollbar
```

### Basic Rollbar Configuration

``` js
const express = require('express')
// Basic Rollbar Usage
const rollbar = require('rollbar')

let app = express()

// Rollback Middleware
app.use(rollbar.errorHandler('TYPE-YOUR-KEY-HERE'))

// Export Express webapp instance
module.exports = app
```
