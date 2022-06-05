"use strict";
import { NodeCG } from '../../../../../../types/server'
let context: NodeCG;

export = {
  get() {
    return context;
  },
  set(ctx: NodeCG) {
    context = ctx;
  },
};
