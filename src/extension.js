const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const St = imports.gi.St;
const Util = imports.misc.util;

const PanelMenu = imports.ui.panelMenu;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Panel = imports.ui.panel;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const GrubLoader = Me.imports.grubLoader;
const Config = Me.imports.config;

const Gettext = imports.gettext.domain('gnome-shell-extension-grub');
const _ = Gettext.gettext;
const N_ = function(x) { return x; }

const ICON_SIZE = 16;
const SECTION_OPTIONS = 'additional-options';
const GLib = imports.gi.GLib;

const GrubMenuItem = Lang.Class({
    Name: 'GrubMenuItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function (info) {
        this.parent();
        this._info = info;

        if (info.icon) {
            this._icon = info.icon;
            this.actor.add_child(this._icon);
        }

        this._label = new St.Label({text: info.alias});
        this.actor.add_child(this._label);
    },
    destroy: function () {
        this.parent();
    },
    activate: function (event) {
        this._info.launch(event.get_time());
        this.parent(event);
    }
});

const GrubMenu = new Lang.Class({
    Name: 'GrubMenu.GrubMenu',
    Extends: PanelMenu.Button,

    _init: function () {
        this.parent(0.0, _("Grub Boot Menu"));
        let hbox = new St.BoxLayout({ style_class: 'panel-status-menu-box' });
        let icon = new St.Icon({ icon_name: 'system-restart',
                             style_class: 'system-status-icon' });
        this.actor.add_actor(icon);
        this._sections = {};
        this.grubLoader = new GrubLoader.GrubLoader();

        // Create menu
        this._create();
    },

    destroy: function () {
        this.parent();
    },
    _redisplayMenu: function () {
        this.menu.removeAll();
        this._create();
    },
    _redisplaySections: function (arr) {
        // TODO: add implementation
    },
    _create: function () {
        this._sections[SECTION_OPTIONS] = new PopupMenu.PopupMenuSection();
        let entries;
        try {
            entries = this._loadMenuEntries();  
        }
        catch (e) {
            // Problems reading file, create menu entry for fixing this
            this._sections[SECTION_OPTIONS].addAction(_('Fix grub config file permissions.'), Lang.bind(this, function (event) {
                let [success, pid] = GLib.spawn_async(null, [Config.PKEXEC_CMD, 'chmod', '644', Config.GRUB_CFG_LOCATION], null,
                                            GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD,
                                            null);
               
                GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, Lang.bind(this, function () {
                    this._redisplayMenu();
                }), null);
            }));
        }

        if (entries && entries.length) {
            let id = 'menu-entries'
            this._sections[id] = new PopupMenu.PopupMenuSection();

            for (let i = 0; i < entries.length; ++i) {
                this._sections[id].addMenuItem(new GrubMenuItem(entries[i]));
            }
        }

        for each (let section in this._sections) {
            section.actor.visible = section.numMenuItems > 0;
            this.menu.addMenuItem(section);
        }
    },
    _loadMenuEntries: function () {
        return this.grubLoader.getEntries();
    }
});

function init() {
    Convenience.initTranslations();
}

let _indicator;

function enable() {
    _indicator = new GrubMenu;
    Main.panel.addToStatusArea('grub-boot-menu', _indicator);
}

function disable() {
    _indicator.destroy();
}
