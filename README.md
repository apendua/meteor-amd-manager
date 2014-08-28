# Notes for Meteor 0.9.x

This package is now called `amd:manager`.

# meteor-amd-manager [![Build Status](https://travis-ci.org/apendua/meteor-amd-manager.svg?branch=master)](https://travis-ci.org/apendua/meteor-amd-manager)

This package provides `AMDManager` class that allows you to implement your own `define/require` module management routines.

## Installation

Simply type
```
meteor add amd:manager
```
and you're good to go.

## Usage

As an example, lets implement the standard `define/reqire` pair. This could be done more like this:
```javascript
var manager = new AMDManager(),

require = function (listOrName, body) {
  var readyDep, isReady;
  if (_.isFunction(body)) {
    if (!_.isArray(listOrName)) {
      listOrName = [listOrName, ];
    }
    return manager.require(listOrName, body);
  } if (_.isString(listOrName)) {
    return manager.get(listOrName);
  }
  throw new Error('Wrong parameters for require.');
}

define = function (name, deps, body) {
  if (arguments.length == 2) {
    body = deps; deps = [];
  }
  manager.define(name, deps, body);
}

define.amd = true;
```

## Methods

The only non-obvious method of the manager is `onModuleNotFound` which allows you to define a callbeck to be called every time should the user request a module that has not been defined yet. You can use it to decide if there is a need to download additional source code from the server.

