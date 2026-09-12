export declare const createCategory: (data: {
    name: string;
    departmentId: string;
    slaHours?: number;
}) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    slaHours: number;
    departmentId: string;
}>;
export declare const getAllCategories: (departmentId?: string) => Promise<({
    department: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
    };
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    slaHours: number;
    departmentId: string;
})[]>;
export declare const getCategoryById: (id: string) => Promise<{
    department: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
    };
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    slaHours: number;
    departmentId: string;
}>;
export declare const updateCategory: (id: string, data: {
    name?: string;
    slaHours?: number;
}) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    slaHours: number;
    departmentId: string;
}>;
export declare const softDeleteCategory: (id: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    slaHours: number;
    departmentId: string;
}>;
//# sourceMappingURL=category.service.d.ts.map