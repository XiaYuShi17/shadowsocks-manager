'use strict';

const flowSaverServer = appRequire('plugins/flowSaver/server');
const index = appRequire('plugins/cli/index');
const inquirer = require('inquirer');

const menu = [
  {
    type: 'list',
    name: 'server',
    message: 'Select server:',
    choices: [],
  }, {
    type: 'list',
    name: 'act',
    message: 'What do you want?',
    choices: ['Switch to it', 'Delete server', 'Edit server'],
  }
];

const editServer = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter server name:',
    validate: function (value) {
      if(value === '') {
        return 'You can not set an empty name.';
      } else {
        return true;
      }
    },
  }, {
    type: 'input',
    name: 'host',
    message: 'Enter server host:',
    validate: function (value) {
      if(value === '') {
        return 'You can not set an empty host.';
      } else {
        return true;
      }
    },
  }, {
    type: 'input',
    name: 'port',
    message: 'Enter server port:',
    validate: function (value) {
      if(Number.isNaN(+value)) {
        return 'Please enter a valid port number.';
      } else if (+value <= 0 || +value >= 65536) {
        return 'Port number must between 1 to 65535.';
      } else {
        return true;
      }
    }
  }, {
    type: 'input',
    name: 'password',
    message: 'Enter password:',
    validate: function (value) {
      if(value === '') {
        return 'You can not set an empty password.';
      } else {
        return true;
      }
    },
  }
];

const list = async () => {
  try {
    const listServer = await flowSaverServer.list();
    menu[0].choices = [];
    listServer.forEach(f => {
      const name = f.name + ' ' + f.host + ':' + f.port;
      const value = {
        name: f.name,
        host: f.host,
        port: f.port,
        password: f.password,
      };
      menu[0].choices.push({name, value});
    });
    const selectServer = await inquirer.prompt(menu);
    if(selectServer.act === 'Switch to it') {
      // const server = listServer.filter(f => {
      //   return f.name === selectServer.server;
      // })[0];
      index.setManagerAddress(selectServer.server.host, selectServer.server.port, selectServer.server.password);
      return;
    } else if (selectServer.act === 'Edit server') {
      const edit = await inquirer.prompt(editServer);
      await flowSaverServer.edit(selectServer.server, edit.name, edit.host, edit.port, edit.password);
      return;
    } else if (selectServer.act === 'Delete server') {
      await flowSaverServer.del(selectServer.server);
      return;
    }
  } catch(err) {
    console.log(err);
    return Promise.reject(err);
  }
};

exports.list = list;
