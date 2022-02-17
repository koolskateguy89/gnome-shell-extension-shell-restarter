const { Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Config = imports.misc.config;
const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major);

const settings = (function() {
    const GioSSS = Gio.SettingsSchemaSource;

    // Load schema
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

    // Load settings from schema
    return new Gio.Settings({ settings_schema: schemaObj });
})();

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

    // TODO: add checkbox/button or smthn to change to default

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
