# Vtex Account Processes

![Build Status](https://github.com/janiscommerce/vtex-account-processes/workflows/Build%20Status/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/vtex-account-processes/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/vtex-account-processes?branch=master)
[![npm version](https://badge.fury.io/js/%40janiscommerce%2Fvtex-account-processes.svg)](https://www.npmjs.com/package/@janiscommerce/vtex-account-processes)

Update Process for VTEX Account in VTEX-Commerce

## :arrow_down: Installation
```sh
npm install @janiscommerce/vtex-account-processes
```

## :wrench: Configuration

:warning: This package need to be instance with [API-Session](https://github.com/janis-commerce/api-session), before use.


:x: Wrong:
```js
const { VtexAccountProcesses } = require('@janiscommerce/vtex-account-processes');

const vtexAccountProcess = new VtexAccountProcesses();
```

:heavy_check_mark: Good:
```js
const { VtexAccountProcesses } = require('@janiscommerce/vtex-account-processes');
const { ApiSession } = require('@janiscommerce/api-session');

const vtexAccountProcess = session.getSessionInstance(VtexAccountProcesses);
```

## :calling: API

* `send(accountId, processName, status, content, options)`
    * **Async**
    * Description: Update `processName` for `accountId` in VTEX-Commerce with `status`.
    * Parameters:
        * `accountId` : *OBJECT-ID* VTEX Account ID in VTEX-Commerce
        * `processName` : *STRING* name of the process
        * `status` : *STRING* new Status for that process
        * `content` : *OBJECT*, **OPTIONAL**, Extra Data you want to add for that process, whatever you want to save, for example a message, or an error stack, etc.
        * `options` : *OBJECT*, **OPTIONAL**, To add the Start Date or an End Date
    * Returns: *OBJECT*
        * `statusCode`: HTTP Status code of the call to VTEX-Commerce
        * `body`: Body response

## :spades: Statuses

You can get the valid Statuses using:

* `statuses`
    * **static getter**
    * Returns: *OBJECT*
        * `pending`
        * `processing`
        * `success`
        * `error`

## :clock1: Options

Now, there are 2 options

* `startDate`: *BOOLEAN*, to add an Date-Now ISO-String, for indicate the start of the process
* `endDate`: *BOOLEAN*, to add an Date-Now ISO-String, for indicate the end of the process

## :arrow_forward: Usage

* Send with minimal data, and pending status, and create a process in VTEX-Commerce

```js

const response = await vtexAccountProcess.send(
    '5dea9fc691240d00084083f8',
    'import-readme',
    VtexAccountProcesses.statuses.pending
)

/*
Response: {
    statusCode: 200,
    body: {
        id: '5dea9fc691240d0008408000'
    }
}

*/

```
* Send with content, and processing status, and Account is not found in VTEX-Commerce

```js

const response = await vtexAccountProcess.send(
    '5dea9fc691240d00084083f8',
    'import-readme',
    VtexAccountProcesses.statuses.processing,
    { itemsImported: 10, itemsNotModified: 1 }
);

/*
Response: {
    statusCode: 404,
    body: {
        message: 'Account not found'
    }
}

*/

```
* Send with a Start Date, and error status, and VTEX-Commerce is failing

```js

const response = await vtexAccountProcess.send(
    '5dea9fc691240d00084083f8',
    'import-readme',
    VtexAccountProcesses.statuses.error,
    null // No Content,
    { startDate: true }
);

/*
Response: {
    statusCode: 503,
    body: {
        message: 'Timeout'
    }
}

*/

```

* Send with an End Date, and success status, and update an existing process in VTEX-Commerce

```js

const response = await vtexAccountProcess.send(
    '5dea9fc691240d00084083f8',
    'import-readme',
    VtexAccountProcesses.statuses.success,
    null // No Content,
    { endDate: true }
);

/*
Response: {
    statusCode: 200,
    body: {
        id: '5dea9fc691240d0008408000'
    }
}

*/

```

## :x: Errors

The errors are informed with a `VtexAccountProcessesError`.
This object has a code that can be useful for a debugging or error handling.
The codes are the following:

| Code | Description            |
|------|------------------------|
| 1    | No Session             |
| 2    | Invalid Account Id     |
| 3    | Invalid Process Name   |
| 4    | Invalid Status         |
| 5    | Invalid Content        |
| 6    | Invalid Options        |

