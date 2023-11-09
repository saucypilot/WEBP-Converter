import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { convertImageToWebp } from './converter';
import { TFile } from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');
		
		// This adds a command to the command palette (Ctrl+P or Cmd+P by default)
		this.addCommand({
			id: 'convert-image-to-webp',
			name: 'Convert Image to WebP',
			checkCallback: (checking: boolean) => {
				if (!checking) {
					// This will open the file explorer to choose an image file

			// Add a command to convert an image to WebP format
			this.addCommand({
				id: 'convert-image-to-webp',
				name: 'Convert Image to WebP',
				checkCallback: (checking: boolean) => {
					if (!checking) {
						// This will open the file explorer to choose an image file
						this.app.vault.selectFile().then((file: TFile) => {
							if (file) {
								// Get the path of the selected file
								const filePath = file.path;
								// Call the convert function from converter.ts
								convertImageToWebp(this.app, filePath).then(() => {
									new Notice('Image conversion to WebP completed.');
								}).catch(err => {
									console.error('Error converting image to WebP:', err);
									new Notice('Error converting image to WebP. Check console for details.');
								});
							}
						});
					}
					// Only show the command when not just checking for its presence
					return !checking;
				},
			});
				// This will open the file explorer to choose an image file
				this.app.vault.chooseFile().then(file => {
				  if (file) {
					// Get the path of the selected file
					const filePath = file.path;
					// Call the convert function from converter.ts
					convertImageToWebp(this.app, filePath).then(() => {
					  new Notice('Image conversion to WebP completed.');
					}).catch(err => {
					  console.error('Error converting image to WebP:', err);
					  new Notice('Error converting image to WebP. Check console for details.');
					});
				  }
				});
			  }
			  // Only show the command when not just checking for its presence
			  return !checking;
			},
		  });

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
