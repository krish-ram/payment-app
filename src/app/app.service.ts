import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { baseUrl, projectKey, userId, sign_version } from "./app.constant";

@Injectable()
export class AppService {

    constructor(private http: HttpClient) { }

    locationUrl: string = baseUrl + 'rest/country/';
    paymentSystemsUrl: string = baseUrl + 'payment-systems/'
    private countriesUrl = "https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;currencies";

    getCountries(): Observable<any> {
        return this.http.get(this.countriesUrl);
    }

    getUserLocation(): Observable<any> {
        let qParams = new HttpParams();
        qParams = qParams.append('key', projectKey);
        qParams = qParams.append('uid', userId);
        return this.http.get(this.locationUrl, { params: qParams })
    }

    getPaymentSystems(countryCode, sign): Observable<any> {
        let qParams = new HttpParams();
        qParams = qParams.append('country_code', countryCode);
        qParams = qParams.append('key', projectKey);
        return this.http.get(this.paymentSystemsUrl, { params: qParams })
    }
}