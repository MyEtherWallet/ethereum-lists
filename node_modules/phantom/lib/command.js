"use strict";Object.defineProperty(exports, "__esModule", { value: true });




let NEXT_ID = 1;

class Command {






  constructor(target, name, params = []) {
    this.id = NEXT_ID;
    NEXT_ID += 1;
    this.target = target;
    this.name = name;
    this.params = params;
    this.deferred = null;
  }}exports.default = Command;