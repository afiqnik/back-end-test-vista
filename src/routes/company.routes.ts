import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import prisma from "../lib/prisma";
import { CreateCompanyDto, CompanyResponseDto } from "../dtos/company.dto";

const router = Router();

router.post(
    "/",
    [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Company name is required"),

        body("registrationNumber")
            .trim()
            .notEmpty()
            .withMessage("Registration number is required"),
    ],
    async (req: Request<{}, {}, CreateCompanyDto>, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        try {
            const { name, registrationNumber } = req.body;

            const company = await prisma.company.create({
                data: {
                    name,
                    registrationNumber,
                },
            });

            const response: CompanyResponseDto = {
                id: company.id,
                name: company.name,
                registrationNumber: company.registrationNumber,
            };

            return res.status(201).json(response);
        } catch (error) {
            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                error.code === "P2002"
            ) {
                return res.status(409).json({
                    message: "A company with this registration number already exists",
                });
            }

            console.error("Failed to create company:", error);

            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }
);

router.get(
    "/",
    async (_req: Request, res: Response) => {
        try {
            const companies = await prisma.company.findMany({
                include: {
                    services: true,
                },
                orderBy: {
                    id: "asc",
                },
            });

            const response: CompanyResponseDto[] = companies.map((company) => ({
                id: company.id,
                name: company.name,
                registrationNumber: company.registrationNumber,
                services: company.services.map((service) => ({
                    id: service.id,
                    companyId: service.companyId,
                    name: service.name,
                    description: service.description,
                    price: service.price.toString(),
                })),
            }));

            return res.status(200).json(response);
        } catch (error) {
            console.error("Failed to fetch companies:", error);

            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }
);

export default router;