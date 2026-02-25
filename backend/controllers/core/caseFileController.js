import CaseFile from "../../models/CaseFiles.js";
import Complaint from "../../models/Complaint.js";

/**
 * Investigator adds notes & files
 */
export const createOrUpdateCaseFile = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { notes } = req.body;
        const investigatorEmail = req.user?.email || req.body.investigatorEmail;

        // ensure complaint exists
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        // investigator must be assigned
        if (!investigatorEmail || complaint.assignedTo !== investigatorEmail) {
            return res.status(403).json({ error: "Not authorized for this case" });
        }

        // prepare uploaded files
        const uploadedFiles = (req.files || []).map(f => ({
            filename: f.filename,
            uploadedAt: new Date()
        }));


        let caseFile = await CaseFile.findOne({ complaintId });

        if (!caseFile) {
            caseFile = await CaseFile.create({
                complaintId,
                investigatorEmail,
                notes,
                files: uploadedFiles
            });
        } else {
            caseFile.notes = notes || caseFile.notes;
            caseFile.files.push(...uploadedFiles);
            await caseFile.save();
        }

        res.json({
            message: "Case file saved successfully",
            caseFile
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Investigator/Admin view case files
 */
export const getCaseFilesByComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params;

        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        if (req.user?.role === "Investigator") {
            if (complaint.assignedTo !== req.user.email) {
                return res.status(403).json({ error: "Not authorized for this case" });
            }
        }

        const caseFile = await CaseFile.findOne({ complaintId });

        if (!caseFile) {
            return res.status(404).json({ error: "No case file found" });
        }

        res.json(caseFile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
