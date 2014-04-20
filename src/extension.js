const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const St = imports.gi.St;

const PanelMenu = imports.ui.panelMenu;
const Main = imports.ui.main;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const Gettext = imports.gettext.domain('gnome-shell-extension-grub');
const _ = Gettext.gettext;
const N_ = function(x) { return x; }

const GrubMenu = new Lang.Class({
    Name: 'GrubMenu.GrubMenu',
    Extends: PanelMenu.Button,

    _init: function () {
        this.parent(0.0, _("Grub Boot Menu"));
        let hbox = new St.BoxLayout({ style_class: 'panel-status-menu-box' });
        let label = new St.Label({ text: _("Grub Boot Menu"),
                                   y_expand: true,
                                   y_align: Clutter.ActorAlign.CENTER });
        hbox.add_child(label);
        hbox.add_child(new St.Label({ text: '\u25BE',
                                      y_expand: true,
                                      y_align: Clutter.ActorAlign.CENTER }));
        this.actor.add_actor(hbox);
    },

    destroy: function () {
        this.parent();
    }
});

function init() {
    Convenience.initTranslations();
}

let _indicator;

function enable() {
    _indicator = new GrubMenu;
    let pos = 1;
    Main.panel.addToStatusArea('grub-boot-menu', _indicator, pos, 'left');
}

function disable() {
    _indicator.destroy();
}