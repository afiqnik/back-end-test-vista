
export interface CreateServiceDto {
    companyId: number;
    name: string;
    description: string;
    price: number;
}

export interface ServiceCompanyDto {
    id: number;
    name: string;
    registrationNumber: string;
}

export interface ServiceResponseDto {
    id: number;
    companyId: number;
    name: string;
    description: string;
    price: string;
    company?: ServiceCompanyDto;
}
