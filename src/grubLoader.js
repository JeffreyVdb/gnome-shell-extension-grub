const Lang = imports.lang;
const Shell = imports.gi.Shell;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Signals = imports.signals;
const Util = imports.misc.util;
const MessageTray = imports.ui.messageTray;
const Main = imports.ui.main;
const GnomeSession = imports.misc.gnomeSession;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Config = Me.imports.config;

const GrubLoader = new Lang.Class({
    Name: 'GrubLoader',

    _init: function () {
        this._entries = [];
    },
    getEntries: function () {
        let cfgFile = Gio.file_new_for_path(Config.GRUB_CFG_LOCATION);
        let size = cfgFile.query_info(
                "standard::size",
                Gio.FileQueryInfoFlags.NONE,
                null).get_size();

        // Might throw exception, catch in main
        let stream = cfgFile.read(null);
        let data = stream.read_bytes(size, null).get_data();
        stream.close(null);

        return this._cfgToEntriesArray(data);
    },
    _cfgToEntriesArray: function (data) {
        let entries = [];

        data = String(data);
        let mEntryRegex = /^\s*menuentry\s+\'(.*?)\'/gm;
        let matchArray;
        while ((matchArray = mEntryRegex.exec(data)) !== null) {
            let eName = matchArray[1];
            let icon = this._findIcon(eName);

            // TODO: match name with alias using hashmap of some kind
            let menuInfo = new GrubEntryInfo(eName, eName, icon);
            entries.push(menuInfo);
        }

        return entries;
    },
    _findIcon: function (entryName) {
        let regExpMap = {
            'fedora':   [/fedora/i],
            'windows8': [/windows\s*8/i],
            'debian': [/debian/i]
        };

        let res;
        mapLoop:
        for (let k in regExpMap) {
            let toCheck = regExpMap[k];
            for (let i = 0; i < toCheck.length; ++i) {
                let rExp = toCheck[i];
                if (rExp.exec(entryName)) {
                    res = k;
                    break mapLoop;
                }
            }
        }

        if (res)
            res = new St.Icon({
                gicon: new Gio.ThemedIcon({name: res}),
                icon_size: 16
            })

        return res;
    }
});

const GrubEntryInfo = new Lang.Class({
    Name: 'GrubEntryInfo',

    _init: function (name, alias, icon) {
        this.name = name;
        this.alias = alias;
        this.icon = icon;
    },
    destroy: function () {
    },
    launch: function (timestamp) {
        // Set entry as the default grub entry
        let success, pid;
        try {
            let cmd = Config.GRUB_SET_DEFAULT_CMD;
            [success, pid] = GLib.spawn_async(null, [Config.PKEXEC_CMD, cmd, this.name], null,
                                    GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD,
                                    null);
        } catch (err) {
            /* Rewrite the error in case of ENOENT */
            if (err.matches(GLib.SpawnError, GLib.SpawnError.NOENT)) {
                throw new GLib.SpawnError({ code: GLib.SpawnError.NOENT,
                                            message: _("Command not found") });
            } else {
                throw err;
            }
        }

        GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, Lang.bind(this, function () {
            // Reboot computer
            this._reboot();
        }), null);
    },
    _reboot: function () {
        Util.spawn(['reboot']);
    }
});
