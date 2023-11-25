import { createReadStream, read } from "fs";
import { join } from "path";
import { ReadStream } from "typeorm/platform/PlatformTools";

export const getPhoto = async (): Promise<Express.Multer.File> => {
    const { buffer, stream } = await getFileToBuffer(
        join(__dirname, "photo-6.png"),
    );
    const photo: Express.Multer.File = {
        fieldname: "",
        originalname: "",
        encoding: "",
        mimetype: "",
        size: 0,
        stream: stream,
        destination: "",
        filename: "",
        path: "",
        buffer: buffer,
    };
    return photo;
};

export const getFileToBuffer = (path: string) => {
    const readStream = createReadStream(path);
    const chunks: Uint8Array[] = [];

    return new Promise<{
        buffer: Buffer;
        stream: ReadStream;
    }>((resolve, reject) => {
        readStream.on("data", (chunk: Buffer) => chunks.push(chunk));

        readStream.on("error", (err) => reject(err));

        readStream.on("close", () =>
            resolve({
                buffer: Buffer.concat(chunks) as Buffer,
                stream: readStream,
            }),
        );
    });
};
