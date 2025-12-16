import CaseActivity from "../models/CaseActivity.js";

export const logCaseActivity = async ({
    complaintId,
    action,
    performedBy,
    role,
    meta = {},
}) => {
    try {
        await CaseActivity.create({
            complaintId,
            action,
            performedBy,
            role,
            meta,
        });
    } catch (err) {
        console.error("CaseActivity log failed:", err.message);
    }
};
