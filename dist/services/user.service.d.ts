export declare const getMyProfile: (userId: string) => Promise<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: import(".prisma/client").$Enums.Role;
    isActive: boolean;
    createdAt: Date;
}>;
export declare const updateUserRole: (targetUserId: string, newRole: "CITIZEN" | "STAFF" | "ADMIN", actorId: string) => Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string | null;
    role: import(".prisma/client").$Enums.Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare const updateMyProfile: (userId: string, data: {
    name?: string;
    phone?: string;
}) => Promise<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: import(".prisma/client").$Enums.Role;
    isActive: boolean;
    updatedAt: Date;
}>;
//# sourceMappingURL=user.service.d.ts.map