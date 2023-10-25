import { App } from 'obsidian';
import webp from 'webp-converter';

export function convertImageToWebp(app: App, filePath: string) {
    // Get the file extension
    const extension = filePath.split('.').pop().toLowerCase();

    // Check if the file is an image
    if (extension !== 'png' && extension !== 'svg' && extension !== 'jpeg' && extension !== 'jpg') {
        console.log('File is not an image');
        return;
    }

    // Convert the image to webp
    const outputFilePath = filePath.replace(`.${extension}`, '.webp');
    webp.cwebp(filePath, outputFilePath, '-q 80', function(status) {
        if (status === '100') {
            console.log('Image converted to webp');

            // Find notes referencing the image
            const referencingFiles = [];
            app.vault.getMarkdownFiles().forEach(file => {
                const fileContent = app.vault.cachedRead(file);
                if (fileContent.includes(filePath)) {
                    referencingFiles.push(file.path);
                }
            });

            // Update the image link in those notes
            referencingFiles.forEach(async (refFilePath) => {
                const noteContent = await app.vault.read(refFilePath);
                const newNoteContent = noteContent.replace(filePath, outputFilePath);
                await app.vault.modify(refFilePath, newNoteContent);
            });
        } else {
            console.log('Error converting image to webp');
        }
    });
}