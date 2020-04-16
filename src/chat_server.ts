import * as net from 'net';
import * as uuid from 'uuid';
import * as config from './config';
import { ConnectedClients, TelnetClient } from './interfaces';

const CONNECTED_CLIENTS: ConnectedClients = {};

const RED_COLOUR: string = '\u001b[31m';
const GREEN_COLOUR: string = '\u001b[32;1m';
const STANDARD_COLOUR: string = ' \u001b[0m';

const WELCOME_MESSAGE: string = `Connected to the server.\r\n
Type /nickname <new nickname> to change your nickname!\r\n
Type anything to send a message then press enter!\r\n`;

/**
 * [handleDataEvent  socket data event handler]
 * @param  data   [data]
 * @param  client [client socket]
 * @return        [description]
 */
function handleDataEvent (data: Buffer, client: TelnetClient): void {
  const message = data.toString();
  if (message.startsWith('/')) {
    if (message.startsWith('/nickname')) {
      changeNickNameCommand(removeNewLine(message.split(' ')[1]), client);
    } else {
      sendServerMessageToClient(`Invalid command ${message}`, client);
    }
  } else {
    sendMessageToAllConnectedClients(message, client);
  }
}

/**
 * [sendMessageToAllConnectedClients description]
 * @param  message [description]
 * @param  sender  [description]
 * @return         [description]
 */
function sendMessageToAllConnectedClients (message: string, sender: TelnetClient): void {
  Object.keys(CONNECTED_CLIENTS).forEach((client_id) => {
    if (client_id === sender.nickname) {
      CONNECTED_CLIENTS[client_id].write(`${STANDARD_COLOUR}[ ${sender.nickname} ]: ${message}\r\n`);
    } else {
      CONNECTED_CLIENTS[client_id].write(`${GREEN_COLOUR}[ ${sender.nickname} ]${STANDARD_COLOUR}:  ${message}\r\n`);
    }
  });
}

/**
 * [changeNickNameCommand /nickname command handler]
 * @param  newNickName [description]
 * @param  client      [description]
 * @return             [description]
 */
function changeNickNameCommand (newNickName, client): void {
  if (newNickName !== '') {
    if (!(newNickName in CONNECTED_CLIENTS)) {
      const oldNickName = client.nickname;
      CONNECTED_CLIENTS[newNickName] = client;
      // tslint:disable-next-line
      delete CONNECTED_CLIENTS[client.nickname];
      client.nickname = newNickName;
      sendServerMessageToClient(`Your nickname is now ${newNickName}`, client);
      sendServerMessageToAllConnectedClients(`${oldNickName} is now known as ${newNickName}`);
    } else {
      if (client.nickname === newNickName) {
        sendServerMessageToClient(`${newNickName} is already your nickname, please choose another nickname`, client);
      } else {
        sendServerMessageToClient(`${newNickName} is already taken, please choose another nickname`, client);
      }
    }
  } else {
    sendServerMessageToClient(`Invalid command, you must provide a nickname`, client);
  }
}

/**
 * [sendServerMessageToAllConnectedClients description]
 * @param  message [description]
 * @param  sender  [description]
 * @return         [description]
 */
function sendServerMessageToAllConnectedClients (message: string): void {
  Object.keys(CONNECTED_CLIENTS).forEach((client_id) => {
    CONNECTED_CLIENTS[client_id].write(`${RED_COLOUR}SERVER MESSAGE: ${message}${STANDARD_COLOUR}\r\n`);
  });
}

/**
 * [sendServerMessageToClient Sends message to a specific client from the server]
 * @param  message [message to send]
 * @param  client  [client socket]
 * @return         [void]
 */
function sendServerMessageToClient (message: string, client: TelnetClient): void {
  client.write(`${RED_COLOUR}SERVER MESSAGE: ${message}${STANDARD_COLOUR}\r\n`);
}

/**
 * [removeNewLine remove new lines from a string]
 * @param  str [string to strip]
 * @return     [cleaned string]
 */
function removeNewLine (str: string): string {
  return str.replace(/(\r\n|\n|\r)/gm, '');
}

const telnetServer = net.createServer((client: net.Socket) => {
  const telnetClient = <TelnetClient> client;
  telnetClient.nickname = `GUEST_${uuid.v4()}`;
  CONNECTED_CLIENTS[telnetClient.nickname] = client;
  client.write(WELCOME_MESSAGE);
  client.write(`Your temporary nickname is ${GREEN_COLOUR}${telnetClient.nickname}${STANDARD_COLOUR}\r\n`);
  sendServerMessageToAllConnectedClients(`${telnetClient.nickname} just joined`);
  client.on('data', (data) => handleDataEvent(data, telnetClient));

  client.on('end', () => {
    // tslint:disable-next-line
    delete CONNECTED_CLIENTS[telnetClient.nickname];
    sendServerMessageToAllConnectedClients(`${telnetClient.nickname} just left`);
  });
});

// tslint:disable-next-line
console.log(`TELNET SERVER RUNNING ON PORT ${config.TELNET_SERVER_PORT}`);
telnetServer.listen(config.TELNET_SERVER_PORT);
