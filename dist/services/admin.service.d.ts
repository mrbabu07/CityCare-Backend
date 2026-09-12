export declare const getDashboardStats: () => Promise<{
    totals: {
        complaints: number;
        users: number;
        citizens: number;
        staff: number;
    };
    resolutionRate: string;
    complaintsByStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ComplaintGroupByOutputType, import(".prisma/client").Prisma.ComplaintScalarFieldEnum | import(".prisma/client").Prisma.ComplaintScalarFieldEnum[]> & {
        _count: true | {
            id?: number;
            title?: number;
            description?: number;
            status?: number;
            priority?: number;
            citizenId?: number;
            categoryId?: number;
            departmentId?: number;
            assignedToId?: number;
            address?: number;
            latitude?: number;
            longitude?: number;
            slaDueAt?: number;
            resolvedAt?: number;
            createdAt?: number;
            updatedAt?: number;
            deletedAt?: number;
            _all?: number;
        } | undefined;
        _avg: {
            latitude?: number | null;
            longitude?: number | null;
        } | undefined;
        _sum: {
            latitude?: number | null;
            longitude?: number | null;
        } | undefined;
        _min: {
            id?: string | null;
            title?: string | null;
            description?: string | null;
            status?: import(".prisma/client").$Enums.ComplaintStatus | null;
            priority?: import(".prisma/client").$Enums.ComplaintPriority | null;
            citizenId?: string | null;
            categoryId?: string | null;
            departmentId?: string | null;
            assignedToId?: string | null;
            address?: string | null;
            latitude?: number | null;
            longitude?: number | null;
            slaDueAt?: Date | null;
            resolvedAt?: Date | null;
            createdAt?: Date | null;
            updatedAt?: Date | null;
            deletedAt?: Date | null;
        } | undefined;
        _max: {
            id?: string | null;
            title?: string | null;
            description?: string | null;
            status?: import(".prisma/client").$Enums.ComplaintStatus | null;
            priority?: import(".prisma/client").$Enums.ComplaintPriority | null;
            citizenId?: string | null;
            categoryId?: string | null;
            departmentId?: string | null;
            assignedToId?: string | null;
            address?: string | null;
            latitude?: number | null;
            longitude?: number | null;
            slaDueAt?: Date | null;
            resolvedAt?: Date | null;
            createdAt?: Date | null;
            updatedAt?: Date | null;
            deletedAt?: Date | null;
        } | undefined;
    })[];
    complaintsByPriority: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ComplaintGroupByOutputType, import(".prisma/client").Prisma.ComplaintScalarFieldEnum | import(".prisma/client").Prisma.ComplaintScalarFieldEnum[]> & {
        _count: true | {
            id?: number;
            title?: number;
            description?: number;
            status?: number;
            priority?: number;
            citizenId?: number;
            categoryId?: number;
            departmentId?: number;
            assignedToId?: number;
            address?: number;
            latitude?: number;
            longitude?: number;
            slaDueAt?: number;
            resolvedAt?: number;
            createdAt?: number;
            updatedAt?: number;
            deletedAt?: number;
            _all?: number;
        } | undefined;
        _avg: {
            latitude?: number | null;
            longitude?: number | null;
        } | undefined;
        _sum: {
            latitude?: number | null;
            longitude?: number | null;
        } | undefined;
        _min: {
            id?: string | null;
            title?: string | null;
            description?: string | null;
            status?: import(".prisma/client").$Enums.ComplaintStatus | null;
            priority?: import(".prisma/client").$Enums.ComplaintPriority | null;
            citizenId?: string | null;
            categoryId?: string | null;
            departmentId?: string | null;
            assignedToId?: string | null;
            address?: string | null;
            latitude?: number | null;
            longitude?: number | null;
            slaDueAt?: Date | null;
            resolvedAt?: Date | null;
            createdAt?: Date | null;
            updatedAt?: Date | null;
            deletedAt?: Date | null;
        } | undefined;
        _max: {
            id?: string | null;
            title?: string | null;
            description?: string | null;
            status?: import(".prisma/client").$Enums.ComplaintStatus | null;
            priority?: import(".prisma/client").$Enums.ComplaintPriority | null;
            citizenId?: string | null;
            categoryId?: string | null;
            departmentId?: string | null;
            assignedToId?: string | null;
            address?: string | null;
            latitude?: number | null;
            longitude?: number | null;
            slaDueAt?: Date | null;
            resolvedAt?: Date | null;
            createdAt?: Date | null;
            updatedAt?: Date | null;
            deletedAt?: Date | null;
        } | undefined;
    })[];
}>;
export declare const getAuditLogs: (page?: number, limit?: number) => Promise<{
    logs: ({
        actor: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        actorId: string;
        action: string;
        entityType: string;
        entityId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
//# sourceMappingURL=admin.service.d.ts.map