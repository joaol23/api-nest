import { userEntityList } from "./user-entity-list";
import { AuthService } from "@/modules/auth/auth.service";
import { accessToken } from '@/testing/access-token.mock';
import { payload } from "./jwt-payload.mock";

export const authServiceMock = {
    provide: AuthService,
    useValue: {
        createToken: jest.fn().mockResolvedValue(accessToken),
        checkToken: jest.fn().mockResolvedValue(payload),
        isValidToken: jest.fn().mockResolvedValue(true),
        login: jest.fn().mockResolvedValue(accessToken),
        forget: jest.fn().mockResolvedValue(true),
        resetPassword: jest.fn().mockResolvedValue(accessToken),
        register: jest.fn().mockResolvedValue(accessToken),
    },
};
