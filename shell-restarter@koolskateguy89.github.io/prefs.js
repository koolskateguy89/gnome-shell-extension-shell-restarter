const { Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const settings = ExtensionUtils.getSettings();

const Config = imports.misc.config;
const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major);

function init() {
}

function buildPrefsWidget() {
    let prefsWidget = new Gtk.Grid({
        ...{
            column_spacing: 12,
            row_spacing: 12,
            visible: true,
            column_homogeneous: true,
        },
        ...(shellVersion >= 40 ?
            {
                margin_top: 18,
                margin_bottom: 18,
                margin_start: 18,
                margin_end: 18,
            }
            :
            {
                margin: 18,
            }
        ),
    });

    let label = new Gtk.Label({
        label: 'Restart message: (may not show on Gnome 40+)',
        halign: Gtk.Align.START,
        visible: true,
    });

    let entry = new Gtk.Entry({
        text: settings.get_string('restart-message'),
        halign: Gtk.Align.END,
        visible: true,
    });

    let defaultButton = new Gtk.Button({
        label: 'Reset to default',
    });

    defaultButton.connect('clicked', () => {
        settings.set_string('restart-message', 'Restarting...');
    });

    prefsWidget.attach(label, 0, 0, 1, 1);
    prefsWidget.attach(entry, 1, 0, 1, 1);

    prefsWidget.attach(defaultButton, 0, 1, 2, 1);

    settings.bind('restart-message', entry, 'text', Gio.SettingsBindFlags.DEFAULT);

    return prefsWidget;
}
