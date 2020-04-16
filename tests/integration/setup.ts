
import * as chai from 'chai';
import * as sinon from 'sinon';

const SANDBOX: sinon.SinonSandbox = sinon.createSandbox();
const expect: Chai.ExpectStatic = chai.expect;

before(async () => {
  require('src/chat_server');

});
afterEach(async () => {
  SANDBOX.restore();
});

/**
 * [timeout waits a given time in ms]
 * @param  ms [millisecond to wait for]
 * @return    [promise<void>]
 */
async function timeout (ms: number): Promise<void> {
  // tslint:disable-next-line
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
  timeout
  uuidStub,
  sinon,
  SANDBOX,
  expect,
};
