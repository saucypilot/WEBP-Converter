import { App } from 'obsidian';
import webp from 'webp-converter';
import { TFile, TAbstractFile } from 'obsidian';

export async function convertImageToWebp(app: App, filePath: string) {
    // Get the file extension
    const extension = filePath.split('.').pop().toLowerCase();
    // Array of image file extensions
    const imageExtensions = ['png', 'svg', 'jpeg', 'jpg'];

    // Check if the file is an image
    if (!imageExtensions.includes(extension)) {
        console.log('File is not an image');
        return;
    }

    // Convert the image to webp
    const outputFilePath = filePath.replace(`.${extension}`, '.webp');
    try {
        const status = await new Promise<string>((resolve, reject) => {
            webp.cwebp(filePath, outputFilePath, '-q 80', (status: string, error: Error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(status);
                }
            });
        });

        if (status === '100') {
            console.log('Image converted to webp');
            
            // Find notes referencing the image
            const referencingFiles: string[] = [];
            const markdownFiles = app.vault.getMarkdownFiles();
            for (const file of markdownFiles) {
                try {
                    const fileContent = await app.vault.cachedRead(file);
                    if (fileContent.includes(filePath)) {
                        referencingFiles.push(file.path);
                    }
                } catch (error) {
                    console.error(`Error reading file ${file.path}:`, error);
                }
            }

            // Update the image link in those notes
            for (const refFilePath of referencingFiles) {
                const refFile = app.vault.getAbstractFileByPath(refFilePath);
                if (refFile instanceof TFile) { // Assuming TFile is the specific class we're interested in
                    try {
                        const noteContent = await app.vault.read(refFile);
                        const newNoteContent = noteContent.split(filePath).join(outputFilePath); // Replaces all occurrences
                        await app.vault.modify(refFile, newNoteContent);
                    } catch (error) {
                        console.error(`Failed to process file ${refFilePath}:`, error);
                    }
                }
            }
        } else {
            console.log('Error converting image to webp');
        }
    } catch (error) {
        console.error('Error during conversion:', error);
    }
}

