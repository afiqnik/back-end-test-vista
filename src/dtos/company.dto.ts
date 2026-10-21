export interface ServiceSummaryDto {
    id: number;
    companyId: number;
    name: string;
    description: string;
    price: string;
}

export interface CompanyResponseDto {
    id: number;
    name: string;
    registrationNumber: string;
    services?: ServiceSummaryDto[];
}

export interface CreateCompanyDto {
    name: string;
    registrationNumber: string;
}