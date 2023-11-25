import { User } from "@modules/user/entity/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { userEntityList } from "./user-entity-list";

export const userRepositoryMock = {
    provide: getRepositoryToken(User),
    useValue: {
        exist: jest.fn().mockResolvedValue(false),
        save: jest.fn().mockResolvedValue(userEntityList[0]),
        find: jest.fn().mockResolvedValue(userEntityList),
        findOneByOrFail: jest.fn().mockResolvedValue(userEntityList[0]),
        update: jest.fn(),
        delete: jest.fn().mockResolvedValue(true),
        countBy: jest.fn().mockResolvedValue(true),
    },
};
