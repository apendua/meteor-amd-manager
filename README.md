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

define.amd = {};
```

## Methods

The only non-obvious methods of the manager are:

 * `onModuleNotFound` which allows you to define a callback to be called every time should the user request a
   module that has not been defined yet. You can use it to decide if there is a need to download additional source
   code from the server.
 * `onModuleAlreadyDefined` which is called when a module is trying to be defined with the same name as an already
   defined module. You can use it to display a warning or throw an error.
