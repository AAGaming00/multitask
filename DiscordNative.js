/*
 * Copyright (c) 2020 AAGaming00
 * Licensed under the Open Software License version 3.0
 */
const os = require('os');
module.exports = (win) => {
    const noop = () => {};
    const DiscordModules = new Map()

    DiscordModules.set('discord_utils', {
        beforeUnload: noop,
        inputEventRegister: noop,
        inputEventUnregister: noop,
        inputSetFocused: noop,
        inputGetRegisteredEvents: noop,
        setCandidateGamesCallback: noop,
        setObservedGamesCallback: noop,
        setGameCandidateOverrides: noop,
        detectPid: noop,
        undetectPid: noop,
        notifyGameLaunched: noop,
        shouldDisplayNotifications: noop,
        setProcessPriority: noop,
        getPidFromWindowHandle: noop,
        getWindowHandleFromPid: noop,
        generateSessionFromPid: noop,
        getAudioPid: noop,
        setForegroundProcess: noop,
        isSystemDarkMode: noop,
        _generateLiveMinidump: noop,
        nativePermssionRequestAuthorization: noop,
        nativePermssionHasAuthorization: noop,
        nativePermissionOpenSettings: noop,
        clearCandidateGamesCallback: noop,
        inputCaptureRegisterElement: noop,
        getGPUDriverVersions: noop,
        submitLiveCrashReport: noop
    })

    DiscordModules.set('discord_game_utils', {})

    DiscordModules.set('discord_voice', {
        DegradationPreference: {
        MAINTAIN_RESOLUTION: 0,
        MAINTAIN_FRAMERATE: 1,
        BALANCED: 2
        },
        initialize: noop,
        setOnVoiceCallback: noop,
        setEmitVADLevel: noop,
        setTransportOptions: noop,
        setDeviceChangeCallback: noop,
        setOutputDevice: noop,
        setInputDevice: noop,
        setVideoInputDevice: noop,
        getOutputDevices: noop,
        getInputDevices: noop,
        getVideoInputDevices: noop,
        addDirectVideoOutputSink: noop,
        removeDirectVideoOutputSink: noop,
        setImageDataAllocator: noop,
        setInputVolume: noop,
        setOutputVolume: noop,
        setVolumeChangeCallback: noop,
        setNoInputThreshold: noop,
        setNoInputCallback: noop,
        getSupportedVideoCodecs: noop,
        setExperimentalAdm: noop,
        getAudioSubsystem: noop,
        getDesktopSources: noop,
        pingVoiceThread: noop,
        getScreenPreviews: noop,
        getWindowPreviews: noop,
        consoleLog: noop,
        writeAudioDebugState: noop,
        setAecDump: noop,
        rankRtcRegions: noop,
        VoiceConnection: noop,
        VoiceReplayConnection: noop,
        createVoiceConnection: noop,
        createOwnStreamConnection: noop,
        createReplayConnection: noop,
        setAudioSubsystem: noop,
        setDebugLogging: noop,
        getDebugLogging: noop,
        addVideoOutputSink: noop,
        removeVideoOutputSink: noop,
        getNextVideoOutputFrame: noop,
        supported: () => false
    })

    function getDiscordModule(m) {
        return DiscordModules.get(m)
    }

    const features = []

    const DiscordNative = {
        isRenderer: true,
        setUncaughtExceptionHandler: noop,
        nativeModules: {
        ensureModule: (m) => win.Promise.resolve(DiscordModules.has(m)),
        requireModule: getDiscordModule,
        canBootstrapNewUpdater: true
        },
        process: {
            platform: process.platform,
            arch: process.arch,
            env: process.env
        },
        os: {
            release: os.release(),
            arch: os.arch()
        },
        app: {
            getReleaseChannel: noop,
            getVersion: () => '',
            getModuleVersions: () => {
                const obj = new win.Object()
                Array.prototype.forEach.call(DiscordModules.keys(), x => obj[x] = '1')
                return obj
            },
            getPath: noop,
            setBadgeCount: noop,
            dock: {
            setBadge: noop,
            bounce: noop,
            cancelBounce: noop
            },
        },
        clipboard: {
        copy: noop,
        copyImage: noop,
        cut: noop,
        paste: noop,
        read: noop
        },
        ipc: {
        send: noop,
        on: noop
        },
        gpuSettings: {
        getEnableHardwareAcceleration: noop,
        setEnableHardwareAcceleration: noop
        },
        window: {
        flashFrame: noop,
        close: window.DiscordNative.window.close,
        fullscreen: window.DiscordNative.window.fullscreen,
        maximize: window.DiscordNative.window.maximize,
        minimize: window.DiscordNative.window.minimize,
        restore: window.DiscordNative.window.restore,
        focus: noop,
        blur: noop,
        setAlwaysOnTop: noop,
        isAlwaysOnTop: noop,
        setZoomFactor: noop,
        setBackgroundThrottling: noop,
        setProgressBar: noop,
        setDevtoolsCallbacks: noop
        },
        powerMonitor: {
        on: noop,
        removeListener: noop,
        removeAllListeners: noop,
        getSystemIdleTimeMs: noop
        },
        spellCheck: {
        on: noop,
        removeListener: noop,
        getAvailableDictionaries: noop,
        setLocale: noop,
        setLearnedWords: noop,
        replaceMisspelling: noop
        },
        crashReporter: {
        updateCrashReporter: noop,
        getMetadata: () => (new win.Object())
        },
        desktopCapture: {
        getDesktopCaptureSources: noop
        },
        fileManager: {
        readLogFiles: noop,
        saveWithDialog: noop,
        openFiles: noop,
        showOpenDialog: noop,
        showItemInFolder: noop,
        getModulePath: noop,
        getModuleDataPathSync: noop,
        extname: noop,
        basename: noop,
        dirname: noop,
        join: noop
        },
        processUtils: {
        flushDNSCache: noop,
        flushCookies: noop,
        flushStorageData: noop,
        purgeMemory: noop,
        getCurrentCPUUsagePercent: noop,
        getCurrentMemoryUsageKB: noop,
        getMainArgvSync: noop
        },
        powerSaveBlocker: {
        blockDisplaySleep: noop,
        unblockDisplaySleep: noop,
        cleanupDisplaySleep: noop
        },
        http: {
        getAPIEndpoint: noop,
        makeChunkedRequest: noop
        },
        accessibility: {
        isAccessibilitySupportEnabled: noop
        },
        features: {
        supports: (f) => features.includes(f),
        declareSupported: (f) => features.push(f)
        },
        settings: {
        get: noop,
        set: noop,
        getSync: noop
        },
        userDataCache: {
        getCached: () => {},
        cacheUserData: noop,
        deleteCache: noop
        },
        thumbar: {
        setThumbarButtons: noop
        }
    }

    DiscordNative.remoteApp = DiscordNative.app;
    DiscordNative.remotePowerMonitor = DiscordNative.powerMonitor;

    win.createDiscordStream = (...args) => new win.MediaStream(...args);

    // win.DiscordNative = new win.Proxy(DiscordNative, {
    //     get: function(obj, prop) {
    //         // console.debug('[Multitask] DiscordNative getting', prop)
    //         // The default behavior to return the value
    //         return obj[prop];
    //     },
    //     set: function(obj, prop, value) {
    //         // console.debug('[Multitask] DiscordNative setting', prop)
    //         // The default behavior to store the value
    //         // obj[prop] = value;
        
    //         // Indicate success
    //         return true;
    //     }
    // })

    win.DiscordNative = DiscordNative;
}