export declare const registerUser: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
}) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const loginUser: (data: {
    email: string;
    password: string;
}) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const refreshAccessToken: (token: string) => Promise<{
    accessToken: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map