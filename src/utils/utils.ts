import * as fs from 'fs';
import { Stream } from 'stream';
import { WriteStream } from 'tty';

export function readFilePromise(filePath: string): Promise<string>{
    return new Promise((resolve, reject) => {
        let readableStream: Stream = fs.createReadStream(filePath, "utf-8");
        let fileContents: string = "";
        readableStream.on("data", (data: string) => {
            fileContents += data;
        })
        readableStream.on("end", () => {
            return resolve(fileContents);
        })
        readableStream.on("error", (error) => {
            return reject(error);
        })
 })
}

export function writeFile(filePath: string, data: string): Promise<string>{
    return new Promise((resolve, reject) => {
        let writeableStream: Stream = fs.createWriteStream(filePath);
        let fileContents: string = "";
        writeableStream.on(data, (err:any) => {
            reject(err)
        });

        writeableStream.on("end", () => {
            return resolve(fileContents);
        })

        writeableStream.on("error", (error) => {
            return reject(error);
        })
    })
}