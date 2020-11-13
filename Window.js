const { React, getModule } = require('powercord/webpack');

function Popout (props) {
  const divRef = div => {
    console.log(div.ownerDocument.defaultView);
    props.resolve(div.ownerDocument.defaultView);
    const win = div.ownerDocument.defaultView;
    delete win.opener;
    delete win.require;
    delete win.DiscordNative;
    win.location.href = props.url;
    win.addEventListener('beforeunload', () => {
      const interval2 = setInterval(() => {
        /*
         * if (!win.location.href.includes('/popout') && !win.DiscordNative) {
         *   win.DiscordNative = window._.cloneDeep(window.DiscordNative);
         *   win.DiscordNative.userDataCache = window._.cloneDeep(DiscordNative.userDataCache);
         *   win.DiscordNative.userDataCache.cacheUserData = () => true;
         *   win.DiscordNative.userDataCache.getCached = () => new Promise(r => r(win.localStorage));
         *   win.DiscordNative.userDataCache.deleteCached = () => [ 'h' ];
         *   win.DiscordNative.nativeModules = window._.cloneDeep(DiscordNative.nativeModules);
         *   win.DiscordNative.nativeModules.requireModule = (e) => {
         *     const o = DiscordNative.nativeModules.requireModule(e);
         *     if (e === 'discord_rpc') {
         *       o.RPCWebSocket.http.createServer = () => new Promise(r => r({}));
         *       o.RPCWebSocket.ws.Server = () => powercord.rpcServer;
         *     }
         *     console.debug('[Multitask] Proxying native module require', e, o);
         *     return o;
         *   };
         * }
         */

        if (win.document.body && !win.location.href.includes('/popout')) {
          clearInterval(interval2);
          if (props.token) {
            console.debug('[Multitask] Overriding localStorage');
            const _ael = win.document.addEventListener;
            win.document.addEventListener = function (...args) {
              if (args[0] !== 'beforeunload') {
                _ael.call(this, ...args);
              }
            };
            const frame = win.document.createElement('iframe');
            win.document.body.appendChild(frame);
            const ls = frame.contentWindow.localStorage;
            const _setItem = ls.setItem;
            ls.setItem = function (key, value) {
              if (key === 'token') {
                return console.debug('[Multitask] Prevented localStorage token update');
              }
              _setItem.call(ls, key, value);
            };

            const _getItem = ls.getItem;
            ls.getItem = function (key) {
              if (key === 'token') {
                console.debug('[Multitask] Attemped to get token');
                return props.token;
              }
              _getItem.call(ls, key);
            };

            /*
             * Object.defineProperty(ls, 'token', {
             *   get : () => {
             *     console.log('[Multitask]: Attemped to get token directly');
             *     return props.token;
             *   },
             *   set : () => console.debug('[Multitask] Prevented localStorage token update')
             * });
             */
            win.localStorage = ls;
            Object.defineProperty(win, 'localStorage', {
              get : () => ls,
              set : (e) => console.debug('[Multitask] Prevented localStorage setter', e)
            });
            const wpinterval = setInterval(() => {
              if (win.webpackJsonp) {
                console.debug('[Multitask] Logging in');
                clearInterval(wpinterval);
                Object.values(win.webpackJsonp.push([ [], { '':(_, e, r) => {
                  e.cache = r.c;
                } }, [ [ '' ] ] ]).cache).find(m => m.exports && m.exports.default && m.exports.default.loginToken !== void 0).exports.default.loginToken(props.token);
              }
            }, 1);
          }
        }
      }, 1);
    });
    const interval = setInterval(() => {
      if (win.require) {
        clearInterval(interval);
        delete win.require;
      }
    }, 10);
  };
  return React.createElement('div', { ref: divRef });
}


module.exports = function (props, name, id) {
  return new Promise((resolve) => {
    const popoutModule = getModule([ 'setAlwaysOnTop', 'open' ], false);
    const PopoutWindow = getModule(m => m.DecoratedComponent && m.DecoratedComponent.render, false);
    popoutModule.open(id, (key) =>
      React.createElement(PopoutWindow, {
        windowKey: key,
        title: name
      }, React.createElement(Popout, { ...props,
        resolve })),
    { frame: false,
      chrome:false,
      status:false,
      menubar:false,
      toolbar:false,
      location:false,
      resizable: false,
      height: props.height,
      width: props.width }
    );
  });
};
