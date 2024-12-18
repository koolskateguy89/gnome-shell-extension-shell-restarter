const { Meta, St, GObject } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const ExtensionUtils = imports.misc.extensionUtils;

// https://discourse.gnome.org/t/retrieve-api-version-in-a-gnome-shell-extension/25623
const gnomeAPIVersion = Number(imports.misc.config.LIBMUTTER_API_VERSION);

let settings;
let restartButton;

const RestartButton = GObject.registerClass(
class RestartButton extends PanelMenu.Button {
    _init() {
        super._init();

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
    }

    destroy() {
        this.button.destroy();
        super.destroy();
    }
});

function restart() {
    // Don't allow blank restart message - or maybe it should?
    // doesn't show in gnome 40 (+?) for me
    const restartMessage = settings.get_string('restart-message') || "Restarting...";
    // Meta.restart API changed in gnome API v11
    if (gnomeAPIVersion < 11) {
        Meta.restart(restartMessage);
    } else {
        Meta.restart(restartMessage, global.context);
    }
}

function init() {
}

function enable() {
    settings = ExtensionUtils.getSettings();
    restartButton = new RestartButton();
}

function disable() {
    settings = null;

    restartButton.destroy();
    restartButton = null;
}
