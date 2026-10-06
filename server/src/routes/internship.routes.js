import { Router } from "express";
import { db } from "../prisma/db";
const router = Router();
// Get all internships
router.get("/", async (_req, res) => {
    try {
        const internships = await db.internship.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({
            success: true,
            data: internships,
        });
    }
    catch (error) {
        console.error("Get internships error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch internships",
        });
    }
});
// Get internship by ID
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid internship ID",
            });
        }
        const internship = await db.internship.findUnique({
            where: { id },
            include: {
                applications: true,
            },
        });
        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found",
            });
        }
        res.json({
            success: true,
            data: internship,
        });
    }
    catch (error) {
        console.error("Get internship error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch internship",
        });
    }
});
// Create internship
router.post("/", async (req, res) => {
    try {
        const { title, company, description, location, mode, duration, stipend, skills, startDate, endDate, mentorId, } = req.body;
        if (!title || !company || !description) {
            return res.status(400).json({
                success: false,
                message: "Title, company and description are required",
            });
        }
        const internship = await db.internship.create({
            data: {
                title,
                company,
                description,
                location: location || null,
                mode: mode || "REMOTE",
                duration: duration || null,
                stipend: stipend ? Number(stipend) : null,
                skills: skills || null,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                mentorId: mentorId ? Number(mentorId) : null,
            },
        });
        res.status(201).json({
            success: true,
            message: "Internship created successfully",
            data: internship,
        });
    }
    catch (error) {
        console.error("Create internship error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create internship",
        });
    }
});
export default router;
//# sourceMappingURL=internship.routes.js.map