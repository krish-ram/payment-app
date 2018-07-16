import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { SignService } from './sign.service';
import { Country } from './country.model';
import { FormGroup } from '@angular/forms';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService, SignService, DecimalPipe, CurrencyPipe]
})
export class AppComponent implements OnInit {
  constructor(private appSrvc: AppService, private signSrvc: SignService, private decimal: DecimalPipe, private currency: CurrencyPipe) { }

  form = new FormGroup({});
  countries: Array<Country>;
  selectedCountry: Country;
  selectedPayment: Object;
  paymentSystems: Array<Object>;
  amount: string;
  newAmount: string;

  showSuccess: boolean;
  showPayment: boolean
  ngOnInit() {
    this.paymentSystems = [];
    this.appSrvc.getUserLocation().subscribe(location => {
      this.appSrvc.getCountries().subscribe(countries => {
        this.countries = countries;
        countries.map(country => {
          if (country.name == location.country)
            this.selectedCountry = country
        })
        //this.selectedCountry = { name: location.country, alpha2Code: location.code };
        this.getPaymentDetails(location.code);
      });
    });

    this.appSrvc.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  transform(event) {
    this.amount = this.decimal.transform(this.amount, '1.2-2');
  }

  getPaymentDetails(countryCode) {
    let sign = this.signSrvc.getSignToken(countryCode);
    this.appSrvc.getPaymentSystems(countryCode, sign).subscribe(response => {
      this.paymentSystems = response;
      this.selectedPayment = response[0];
    });
  }

  selectCountry(event) {
    this.getPaymentDetails(event.value.alpha2Code);
  }

  onSubmit() {
    if (this.amount && this.selectedCountry && this.selectedCountry.alpha2Code
      && this.selectedPayment && this.selectedPayment['ps_type_id']) {
      let amount = this.amount.replace(/\,/g, '');
      this.newAmount = this.currency.transform(amount, this.selectedCountry.currencies[0]['code'], 'code', '1.2-2')
      this.showPayment = true;
    }
  }

  paymentStatus(status) {
    if (status) {
      this.showSuccess = true;
    }
  }
}
