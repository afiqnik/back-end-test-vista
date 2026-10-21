
import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import {
    CreateServiceDto,
    ServiceResponseDto,
} from "../dtos/service.dto";

const router = Router();

router.post(
    "/",
    [
        body("companyId")
            .isInt({ min: 1 })
            .withMessage("A valid company ID is required"),

        body("name")
            .trim()
            .notEmpty()
            .withMessage("Service name is required"),

        body("description")
            .trim()
            .notEmpty()
            .withMessage("Service description is required"),

        body("price")
            .isFloat({ min: 0 })
            .withMessage("Price must be a non-negative number"),
    ],
    async (req: Request<{}, {}, CreateServiceDto>, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        try {
            const { companyId, name, description, price } = req.body;

            const service = await prisma.service.create({
                data: {
                    companyId,
                    name,
                    description,
                    price: new Prisma.Decimal(price),
                },
            });

            const response: ServiceResponseDto = {
                id: service.id,
                companyId: service.companyId,
                name: service.name,
                description: service.description,
                price: service.price.toString(),
            };

            return res.status(201).json(response);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2003"
            ) {
                return res.status(400).json({
                    message: "The specified company does not exist",
                });
            }

            console.error("Failed to create service:", error);

            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }
);


router.get(
    "/:id",
    async (req: Request<{ id: string }>, res: Response) => {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: "A valid service ID is required",
            });
        }

        try {
            const service = await prisma.service.findUnique({
                where: {
                    id,
                },
                include: {
                    company: true,
                },
            });

            if (!service) {
                return res.status(404).json({
                    message: "Service not found",
                });
            }

            const response: ServiceResponseDto = {
                id: service.id,
                companyId: service.companyId,
                name: service.name,
                description: service.description,
                price: service.price.toString(),
                company: {
                    id: service.company.id,
                    name: service.company.name,
                    registrationNumber: service.company.registrationNumber,
                },
            };

            return res.status(200).json(response);
        } catch (error) {
            console.error("Failed to fetch service:", error);

            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }
);


export default router;
