import express from "express";
import cors from "cors";
import companyRoutes from "./routes/company.routes";
import serviceRoutes from "./routes/service.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "JIP API is running",
    });
});

app.use("/companies", companyRoutes);
app.use("/services", serviceRoutes);

export default app;