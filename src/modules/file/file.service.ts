import { Injectable } from "@nestjs/common";
import { writeFile } from "fs/promises";
import { join } from "path";

@Injectable()
export class FileService {
    private getDestinationPath(): string {
        return join(__dirname, "..", "..", "storage", "photos");
    }

    async upload(file: Express.Multer.File, fileName: string): Promise<string> {
        await writeFile(join(this.getDestinationPath(), fileName), file.buffer);
        return join(this.getDestinationPath(), fileName);
    }
}
