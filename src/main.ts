import { Menu, Notice, Plugin, Vault} from "obsidian";
import { MouseEvent } from 'react';
import { convertImageToWebp } from "./converter";
import { TFile } from "obsidian"; 

export default class WEBPConverterPlugin extends Plugin {
	async onload() {
		console.log("loading plugin");
		const webpMenu = new Menu();

		webpMenu.addItem((item)	=>
			item.setTitle("Convert to WebP").onClick(() => {
				convertImageToWebp( this.app.workspace.getActiveFile(), /* destination should be where the original image was */ );
				new Notice("Converted to WebP");
			})
		);

		webpMenu.showAtMouseEvent(MouseEvent);
	}

	onunload() {
		console.log("unloading plugin");
	}
}
