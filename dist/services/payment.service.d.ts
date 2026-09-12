export declare const initiatePayment: (complaintId: string, userId: string) => Promise<{
    paymentUrl: any;
    paymentId: string;
}>;
export declare const verifyAndUpdatePayment: (paymentId: string, status: "success" | "fail" | "cancel") => Promise<{
    status: "success" | "fail" | "cancel";
}>;
export declare const getPaymentStatus: (complaintId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import(".prisma/client").$Enums.PaymentStatus;
    complaintId: string;
    userId: string;
    amount: number;
    currency: string;
    provider: string;
    providerRef: string | null;
}>;
//# sourceMappingURL=payment.service.d.ts.map