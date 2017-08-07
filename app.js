#!/usr/bin/env node

'use strict';

import Servers from './scripts/servers'

class App {
  run(){
    // const servers = require('./scripts/servers');
    // servers();
    new Servers().run();
  }
}

new App().run();
