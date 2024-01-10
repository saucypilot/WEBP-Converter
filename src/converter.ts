import webp from "webp-converter";
import { TFile } from "obsidian";

webp.grant_permission(); // this will grant 755 permission to webp executables

export async function convertImageToWebp(inputFile: TFile, destination: string) {
    const filePath = inputFile.path;
    await webp.cwebp(filePath, destination, "-q 80", function(status: unknown, error: unknown){
        console.log(status, error);
    });
}
