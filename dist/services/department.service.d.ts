export declare const createDepartment: (data: {
    name: string;
    description?: string;
}) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string | null;
}>;
export declare const getAllDepartments: () => Promise<({
    categories: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slaHours: number;
        departmentId: string;
    }[];
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string | null;
})[]>;
export declare const getDepartmentById: (id: string) => Promise<{
    categories: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slaHours: number;
        departmentId: string;
    }[];
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string | null;
}>;
export declare const updateDepartment: (id: string, data: {
    name?: string;
    description?: string;
}) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string | null;
}>;
export declare const softDeleteDepartment: (id: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string | null;
}>;
//# sourceMappingURL=department.service.d.ts.map