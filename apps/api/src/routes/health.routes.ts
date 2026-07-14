import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
    res.json({
        service: "MedicOS API",
        status: "healthy"
    });
});

export default router;