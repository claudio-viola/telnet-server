// tslint:disable:arrow-return-shorthand
// tslint:disable:max-func-body-length
// tslint:disable:no-big-function
// tslint:disable:no-duplicate-string
// tslint:disable:no-unused
// tslint:disable:no-identical-functions
// tslint:disable:max-line-length
import * as net from 'net';
import * as config from 'src/config';
import * as uuid from 'uuid';
import {
  expect,
  SANDBOX,
  sinon,
} from './setup';

let uuidStub;

describe('Telnet Server Tests', (): void => {
  beforeEach(() => {
    uuidStub = SANDBOX.stub(uuid, 'v4');
  });
  it('should connect to the telnet server on port 100000', async () => {
    return new Promise(async (resolve, reject) => {
      uuidStub.returns('392cb19f-36f8-4ded-b313-c6231a0cc7fb');
      const connectedClient = net.createConnection({
        port: 10000,
      });

      connectedClient.on('connect', () => {
        resolve();
      });
      await timeout(500);
      reject('it should have finished within 500 ms');
    });
  });
  describe('when connected', () => {
    it('should receive a welcome message', async () => {
      return new Promise(async (resolve, reject) => {
        uuidStub.returns('1562196f-0d7b-4b03-8375-ea886ab7b0b6');
        const connectedClient = net.createConnection({
          port: 10000,
        });
        const expectedWelcomeMessage = `Connected to the server.\r\n\nType /nickname <new nickname> to change your nickname!\r\n\nType anything to send a message then press enter!\r\nYour temporary nickname is \u001b[32;1mGUEST_1562196f-0d7b-4b03-8375-ea886ab7b0b6 \u001b[0m\r\n\u001b[31mSERVER MESSAGE: GUEST_1562196f-0d7b-4b03-8375-ea886ab7b0b6 just joined \u001b[0m\r\n`;
        connectedClient.on('data', (data) => {
          expect(data.toString()).to.equal(expectedWelcomeMessage);
          resolve();
        });
        await timeout(500);
        reject('it should have finished within 500 ms');
      });
    });

    it('should allow to change the nickname', async () => {
      return new Promise(async (resolve, reject) => {
        uuidStub.returns('1562196f-0d7b-4b03-8375-ea886ab7b0b6');
        const connectedClient = net.createConnection({
          port: 10000,
        });
        const expectedChangeNickNameMessage = `SERVER MESSAGE: Your nickname is now newnick \u001b[0m\r\n\u001b[31mSERVER MESSAGE: GUEST_1562196f-0d7b-4b03-8375-ea886ab7b0b6 is now known as newnick \u001b[0m\r\n`;
        connectedClient.write('/nickname newnick');
        let streamedText: string = '';
        connectedClient.on('data', (data) => {
          streamedText = streamedText.concat(data.toString());
        });
        await timeout(1000);
        expect(streamedText).to.contain(expectedChangeNickNameMessage);
        resolve();
      });
    });

    it('should send a message to all connected clients', async () => {
      return new Promise(async (resolve, reject) => {
        uuidStub.restore();
        const telnetConnections = [];
        const streamedMessages = [];
        for (let i = 0; i < 10; i++) {
          telnetConnections[i] = net.createConnection({
            port: 10000,
          });
          streamedMessages[i] = '';
          telnetConnections[i].on('data', (data) => {
            streamedMessages[i] = streamedMessages[i].concat(data.toString());
          });
        }
        const senderClient = net.createConnection({
          port: 10000,
        });
        senderClient.write('/nickname tester');
        await timeout(500);
        senderClient.write('HELLO EVERYBODY!!!');

        await timeout(2000);
        for (let i = 0; i < 10; i++) {
          expect(streamedMessages[i]).to.contain('\u001b[0m\r\n\u001b[32;1m[ tester ] \u001b[0m:  HELLO EVERYBODY!!!\r\n');
        }
        resolve();
      });
    });

  });

});
