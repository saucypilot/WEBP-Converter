import { App } from 'obsidian';
import webp from 'webp-converter';

export function convertImageToWebp(app: App, filePath: string) {
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
    webp.cwebp(filePath, outputFilePath, '-q 80', function(status: string) {
        if (status === '100') {
            console.log('Image converted to webp');

            // Find notes referencing the image
            const referencingFiles: string[] = [];
            app.vault.getMarkdownFiles().forEach(async file => {
                const fileContent = await app.vault.cachedRead(file);
                if (fileContent.includes(filePath)) {
                    referencingFiles.push(file.path);
                }
            });

            // Update the image link in those notes
            referencingFiles.forEach(async (refFilePath) => {
                const refFile = app.vault.getAbstractFileByPath(refFilePath);
                if (refFile instanceof TAbstractFile && refFile instanceof TFile) {
                    const noteContent = await app.vault.read(refFile);
                    const newNoteContent = noteContent.replace(filePath, outputFilePath);
                    await app.vault.modify(refFile, newNoteContent);
                }
            });
        } else {
            console.log('Error converting image to webp');
        }
    });
}