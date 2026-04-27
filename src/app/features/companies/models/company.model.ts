export interface Company {
    id: number;
    name: string;
    fantasyName: string;
    email: string;
    cnpj: string;
    companyGroupId: number;
    companyGroupName?: string;
    userCount?: number;
    apiKey?: string;
}
