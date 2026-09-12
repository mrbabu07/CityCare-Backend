import { ComplaintStatus, ComplaintPriority } from "@prisma/client";
export declare const createComplaint: (citizenId: string, data: {
    title: string;
    description: string;
    categoryId: string;
    address: string;
    latitude?: number;
    longitude?: number;
    priority?: ComplaintPriority;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string;
    departmentId: string;
    title: string;
    status: import(".prisma/client").$Enums.ComplaintStatus;
    priority: import(".prisma/client").$Enums.ComplaintPriority;
    citizenId: string;
    categoryId: string;
    assignedToId: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    slaDueAt: Date | null;
    resolvedAt: Date | null;
}>;
export declare const getComplaintById: (id: string) => Promise<{
    department: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
    };
    category: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slaHours: number;
        departmentId: string;
    };
    feedback: {
        id: string;
        createdAt: Date;
        citizenId: string;
        complaintId: string;
        rating: number;
        comment: string | null;
    } | null;
    citizen: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
    };
    assignedTo: {
        id: string;
        name: string;
        email: string;
    } | null;
    statusHistory: {
        id: string;
        createdAt: Date;
        complaintId: string;
        fromStatus: import(".prisma/client").$Enums.ComplaintStatus | null;
        toStatus: import(".prisma/client").$Enums.ComplaintStatus;
        changedById: string;
        note: string | null;
    }[];
    attachments: {
        id: string;
        createdAt: Date;
        type: string;
        complaintId: string;
        url: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string;
    departmentId: string;
    title: string;
    status: import(".prisma/client").$Enums.ComplaintStatus;
    priority: import(".prisma/client").$Enums.ComplaintPriority;
    citizenId: string;
    categoryId: string;
    assignedToId: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    slaDueAt: Date | null;
    resolvedAt: Date | null;
}>;
export declare const getComplaints: (params: {
    page?: number;
    limit?: number;
    status?: ComplaintStatus;
    departmentId?: string;
    citizenId?: string;
    assignedToId?: string;
    search?: string;
}) => Promise<{
    complaints: ({
        department: {
            id: string;
            name: string;
        };
        category: {
            id: string;
            name: string;
        };
        citizen: {
            id: string;
            name: string;
        };
        assignedTo: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string;
        departmentId: string;
        title: string;
        status: import(".prisma/client").$Enums.ComplaintStatus;
        priority: import(".prisma/client").$Enums.ComplaintPriority;
        citizenId: string;
        categoryId: string;
        assignedToId: string | null;
        address: string;
        latitude: number | null;
        longitude: number | null;
        slaDueAt: Date | null;
        resolvedAt: Date | null;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const updateComplaintStatus: (complaintId: string, newStatus: ComplaintStatus, changedById: string, note?: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string;
    departmentId: string;
    title: string;
    status: import(".prisma/client").$Enums.ComplaintStatus;
    priority: import(".prisma/client").$Enums.ComplaintPriority;
    citizenId: string;
    categoryId: string;
    assignedToId: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    slaDueAt: Date | null;
    resolvedAt: Date | null;
}>;
export declare const assignStaffToComplaint: (complaintId: string, staffId: string, changedById: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string;
    departmentId: string;
    title: string;
    status: import(".prisma/client").$Enums.ComplaintStatus;
    priority: import(".prisma/client").$Enums.ComplaintPriority;
    citizenId: string;
    categoryId: string;
    assignedToId: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    slaDueAt: Date | null;
    resolvedAt: Date | null;
}>;
export declare const softDeleteComplaint: (id: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string;
    departmentId: string;
    title: string;
    status: import(".prisma/client").$Enums.ComplaintStatus;
    priority: import(".prisma/client").$Enums.ComplaintPriority;
    citizenId: string;
    categoryId: string;
    assignedToId: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    slaDueAt: Date | null;
    resolvedAt: Date | null;
}>;
//# sourceMappingURL=complaint.service.d.ts.map