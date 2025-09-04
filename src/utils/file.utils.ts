import { unlink } from "node:fs/promises";
import * as fs from "fs";
import path from "node:path";

export function deleteFile(relativePath: string){
    const fullpath = path.join(process.cwd(), relativePath);

    fs.access(fullpath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File does not exist: ${fullpath}`);
            return;
        }
        fs.unlink(fullpath, (unlinkErr) => {
            if (unlinkErr) {
                console.error(`Error deleting file: ${fullpath}`, unlinkErr);
            }else {
                console.log(`File deleted successfully: ${fullpath}`);
            }
        });
    });
}