import { Test, TestingModule } from "@nestjs/testing";
import { FileService } from "./file.service";
import { getPhoto } from "@/testing/photo.mock";

describe("Files", () => {
    let fileService: FileService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileService],
        }).compile();

        fileService = module.get<FileService>(FileService);
    });

    test("Validar a definiçao", () => {
        expect(fileService).toBeDefined();
    });

    test("Teste do method de upload", async () => {
        const path = fileService.upload(await getPhoto(), "tets.png");
        expect(path).toContain("tets.png");
    });
});
