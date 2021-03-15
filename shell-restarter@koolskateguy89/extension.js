const { Gio, Meta, St } = imports.gi;

const Lang = imports.lang;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const settings = (function() {
    const GioSSS = Gio.SettingsSchemaSource;

    let schemaSource = GioSSS.new_from_directory(
        Me.dir.get_child('schemas').get_path(),
        GioSSS.get_default(),
        false
    );

    let schemaObj = schemaSource.lookup(
        'org.gnome.shell.extensions.shell-restarter',
        true
    );

    if (!schemaObj)
        throw new Error(`Schema could not be found for extension ${Me.metadata.uuid}. Please check your installation`);

    return new Gio.Settings({ settings_schema: schemaObj });
})();

const RestartButton = new Lang.Class({
	Name: 'Shell-Restarter',
	Extends: PanelMenu.Button,

	_init: function() {
		this.parent(0, 'Shell-Restarter');

		this.button = new St.Icon({
            icon_name : 'view-refresh-symbolic',
        	style_class : 'system-status-icon',
            reactive: true,
		});

		this.button.connect('button-press-event', restart);

		if ((typeof this.add_child) === 'function')
			this.add_child(this.button);
		else
			this.actor.add_actor(this.button);	// deprecated in newer GNOME versions

		Main.panel.addToStatusArea('shell-restarter', this);
	},

	destroy: function() {
		this.button.destroy();

		this.parent();
	}
});

function restart() {
	// Don't allow blank restart message - or maybe it should?
	Meta.restart(settings.get_string('restart-message') || "Restarting...");
}

var container;

function init() {
}

function enable() {
	container = new RestartButton();
}

function disable() {
	container.destroy();
}
