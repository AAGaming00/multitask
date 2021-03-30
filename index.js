/*
 * Copyright (c) 2020 Bowser65, AAGaming00
 * Licensed under the Open Software License version 3.0
 */

const { join } = require('path');
const { Plugin } = require('powercord/entities');
const { Tooltip, Icons: { ExternalLink } } = require('powercord/components');
const { inject, uninject } = require('powercord/injector');
const { React, getModule, getModuleByDisplayName, constants: { Routes } } = require('powercord/webpack');
const { open: openModal } = require('powercord/modal');
const { sleep, getOwnerInstance, waitFor } = require('powercord/util');

const SwitchIcon = require('./components/SwitchIcon');
const Settings = require('./components/Settings');
const Modal = require('./components/Modal');

module.exports = class Multitask extends Plugin {
  async startPlugin () {
    /*
     * if (window.GlasscordApi) { // @todo: Glasscord compatibility
     *   this.error('Glasscord detected. Multitask is not compatible with Glasscord yet.');
     *   this.error('Aborting startup.');
     *   return;
     * }
     */

    this.loadStylesheet('style.scss');
    powercord.api.settings.registerSettings('multitask', {
      category: this.entityID,
      label: 'Multitask',
      render: Settings
    });

    this._addPopoutIcon();
    if (!this.settings.get('accounts')) {
      const tokenModule = await getModule([ 'getToken' ]);
      const userModule = await getModule([ 'getCurrentUser' ]);
      let user;
      while (!(user = userModule.getCurrentUser())) {
        await sleep(10);
      }
      this.settings.set('accounts', [
        {
          name: user.tag,
          token: tokenModule.getToken()
        }
      ]);
    }
  }

  pluginWillUnload () {
    powercord.api.settings.unregisterSettings('multitask');
    uninject('multitask-icon');
  }

  async _addPopoutIcon () {
    const classes = await getModule([ 'iconWrapper', 'clickable' ]);
    const HeaderBarContainer = await getModuleByDisplayName('HeaderBarContainer');
    inject('multitask-icon', HeaderBarContainer.prototype, 'renderLoggedIn', (args, res) => {
      if (res.props.toolbar && res.props.toolbar.props.children && res.props.toolbar.props.children[0][0]) {
        const guildId = res.props.toolbar.props.children[0][0].key === 'calls' ? '@me' : res.props.toolbar.props.children[1].key;
        const channelId = res.props.toolbar.props.children[0][1].props.channel.id;
        res.props.toolbar.props.children.unshift(
          React.createElement(Tooltip, {
            text: 'Popout',
            position: 'bottom'
          }, React.createElement('div', {
            className: [ 'multitask-icon', classes.iconWrapper, classes.clickable ].join(' ')
          }, React.createElement(ExternalLink, {
            className: [ 'multitask-icon', classes.icon ].join(' '),
            onClick: () => this._openPopout(guildId, channelId)
          })))
        );
      }

      if (this.settings.get('accounts').length > 1) {
        const Switcher = React.createElement(Tooltip, {
          text: 'Switch account',
          position: 'bottom'
        }, React.createElement('div', {
          className: [ 'multitask-icon', classes.iconWrapper, classes.clickable ].join(' ')
        }, React.createElement(SwitchIcon, {
          className: [ 'multitask-icon', classes.icon ].join(' '),
          onClick: () =>
            openModal(() => React.createElement(Modal, {
              accounts: this.settings.get('accounts'),
              open: this._openPopout.bind(this)
            }))
        })));

        if (!res.props.toolbar) {
          res.props.toolbar = Switcher;
        } else {
          res.props.toolbar.props.children.push(Switcher);
        }
      }

      return res;
    });
    this.reloadTitle();
  }

  async reloadTitle () {
    const { title } = await getModule([ 'title', 'chatContent' ]);
    getOwnerInstance(await waitFor(`.${title}`)).forceUpdate();
  }

  _openPopout (guildId, channelId, token) {
    require('./Window')({ url: guildId ? `${location.origin}/channels/${guildId}/${channelId}` : `${location.origin}/app `,
      token }, 'Discord', 'DISCORD_MULTITASK_' + Math.random().toString(36).substring(10));
  }
};
