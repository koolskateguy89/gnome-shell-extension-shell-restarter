const { Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

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
        margin: 18,
        column_spacing: 12,
        row_spacing: 12,
        visible: true,
        column_homogeneous: true,
    });

    let label = new Gtk.Label({
        label: 'Restart message:',
        halign: Gtk.Align.START,
        visible: true,
    });

    let entry = new Gtk.Entry({
        text: settings.get_string('restart-message'),
        halign: Gtk.Align.END,
        visible: true,
    });

    // TODO: add checkbox/button or smthn to change to default

    prefsWidget.attach(label, 0, 0, 1, 1);
    prefsWidget.attach(entry, 1, 0, 1, 1);

    settings.bind('restart-message', entry, 'text', Gio.SettingsBindFlags.DEFAULT);

    return prefsWidget;
}
