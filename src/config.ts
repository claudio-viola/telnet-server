// tslint:disable-next-line
require('dotenv').config();
import * as assert from 'assert';

export const TELNET_SERVER_PORT: number = Number(process.env.TELNET_SERVER_PORT);
assert(!isNaN(TELNET_SERVER_PORT) && TELNET_SERVER_PORT >= 1024 && TELNET_SERVER_PORT <= 65535,
  'TELNET_SERVER_PORT var must be a valid port number between 1024 and 65535');
