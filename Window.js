/*
 * Copyright (c) 2020 AAGaming00
 * Licensed under the Open Software License version 3.0
 */
const { React, getModule } = require('powercord/webpack');
const { join } = require('path');
const createDiscordNative = require('./DiscordNative');
const nt = () => new Promise(res => process.nextTick(res))

function Popout (props) {
  const divRef = async div => {
    //console.group('[Multitask:Init]');
    // console.log(div.ownerDocument.defaultView);
    props.resolve(div.ownerDocument.defaultView);
    const win = div.ownerDocument.defaultView;
    // stop discord from yeeting the popout
    const oFnc = window.Function;
    window.Function = win.Function;
    const yeetListener = (e) => {
      console.debug('[Multitask] yeeted listener')
      e.stopPropagation()
    }
    win.addEventListener('beforeunload', yeetListener, { capture: true })
    delete win.opener;
    win.location.href = props.url;
    delete win.require;
    while (win.location.href.indexOf('/popout') > -1) {
      await nt();
    }
    const oopener = win.opener
    delete win.opener;
    win.__isMultitask = true;
    createDiscordNative(win)
    console.debug('[Multitask] hm', Boolean(win.webpackJsonp))
    function getNativeTitlebar (){
      switch(process.platform){
        case "win32": return "windows";
        case "darwin": return "osx";
        case "linux": default: return "linux";
      }
    }
    let patchedPush = false;

    let wjp = new win.Array()

    Object.defineProperty(win, "webpackJsonp", {
      get: () => {
        return wjp;
      },
      set: (newWebpackJsonp) => {
        window.Function = win.Function;
        //debugger;
        if (!patchedPush && newWebpackJsonp.hasOwnProperty("push")) {
          patchedPush = true;
          originalPush = { ...newWebpackJsonp }.push;
          newWebpackJsonp.push = ([something, modules, somethingElse]) => {
            window.Function = win.Function;
    
            try {
              const keys = win.Object.keys(modules);
              for (const key of keys) {
                const originalModule = win.Array.isArray(modules)
                  ? [...modules][key]
                  : { ...modules }[key];
    
                modules[key] = (exporter, t, webpackRequire) => {
                  window.Function = win.Function;
    
                  modules[key] = originalModule;
                  // console.debug('[Multitask] a') 
                  win._module = originalModule;
                  originalModule(exporter, t, webpackRequire);
                  // console.debug('[Multitask] b') 
                  
                  if (exporter.exports?.default?.getToken && exporter.exports?.default?.hideToken) {
                    console.debug('[Multitask] found token module', exporter.exports)
                    const def = exporter.exports.default;
                    const noop = () => {};
                    if (props.token) def.getToken = () => props.token;
                    def.hideToken = noop
                    def.showToken = noop
                    def.removeToken = noop
                    def.setToken = noop

                    // win.DiscordNative = {};
                    // win.DiscordNative.window = {
                    //   close: (k) => window.DiscordNative.close(k || win.name),
                    //   fullscreen: (k) => window.DiscordNative.fullscreen(k || win.name),
                    //   maximize: (k) => window.DiscordNative.maximize(k || win.name),
                    //   minimize: (k) => window.DiscordNative.minimize(k || win.name),
                    //   restore: (k) => window.DiscordNative.restore(k || win.name)
                    // }
                  }

                  if (exporter.exports?.default?.toString?.().indexOf('macOSFrame') > -1) {
                    console.debug('[Multitask] found titlebar module', exporter.exports)
                    // based on some glasscord stuff
                    
                    const os = getNativeTitlebar()
                    const titleBar = exporter.exports
                    const orig = titleBar.default;
                    titleBar.default = function(props) {
                      props.type = os.toUpperCase();
                      props.windowKey = win.name;
                      const res = orig(props)
                      return res
                    };
                    titleBar.default.toString = () => orig.toString();
                    Object.assign(titleBar.default, orig)

                    const appMount = win.document.getElementById("app-mount");
                    appMount.classList.remove("platform-win");
                    appMount.classList.remove("platform-osx");
                    appMount.classList.remove("platform-linux");
                
                    const className = os == "windows" ? "win" : os;
                    appMount.classList.add(`platform-${className}`);
                  }
    
                  window.Function = oFnc;
                };
              }
              window.Function = oFnc;
            } catch (e) {
              console.error("Something has gone horribly wrong.", e);
            }
            return originalPush(
              somethingElse
                ? [something, modules, somethingElse]
                : [something, modules]
            );
          };
        }
    
        wjp = newWebpackJsonp;
    
        window.Function = oFnc;
      },
    });
    win.document.addEventListener('DOMContentLoaded', (event) => {
      console.debug('[Multitask] DOM fully loaded and parsed', Boolean(win.webpackJsonp));
      // win.console.log(win, win.webpackJsonp)
    });
    win.addEventListener('load', _ => {
      win.removeEventListener('beforeunload', yeetListener, { capture: true })
      oopener.popouts.set(win.name, win);
    });
    win.addEventListener('beforeunload', () => {
      oopener.popouts.delete(win.name);
    });

    window.Function = oFnc;
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
    {
      width: 500,
      height: 500
    }
    );
  });
};
