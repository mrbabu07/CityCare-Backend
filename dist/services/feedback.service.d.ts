export declare const createFeedback: (complaintId: string, citizenId: string, data: {
    rating: number;
    comment?: string;
}) => Promise<{
    id: string;
    createdAt: Date;
    citizenId: string;
    complaintId: string;
    rating: number;
    comment: string | null;
}>;
//# sourceMappingURL=feedback.service.d.ts.map