export interface CreateCompanyGroupCommand {
    name: string;
    externalId: string;
}

export interface UpdateCompanyGroupCommand {
    id: number;
    name: string;
    externalId: string;
}
