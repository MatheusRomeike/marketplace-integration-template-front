import { firstValueFrom, Observable } from "rxjs";
import { BaseService } from "../../core/services/base.service";
import { Tenant } from "../models/tenant";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseService {

    constructor() {
        super('api/users');
    }

    public GetUserCompanies(): Observable<Array<Tenant>> {
        return this.get<Array<Tenant>>('/companies');
    }

}