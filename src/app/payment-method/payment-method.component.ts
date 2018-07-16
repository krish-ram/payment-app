import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as luhn from 'luhn';


@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {

  @Input() payment: Object;
  @Input() amount: string;
  @Output() paymentSuccess = new EventEmitter();

  cardName: string;
  cardNo: string;
  month: number;
  year: number;
  cvv: number;

  nameError: boolean;
  cardError: boolean;
  monthError: boolean;
  yearError: boolean;
  cvvError: boolean;

  paymentForm = new FormGroup({});
  constructor() { }

  ngOnInit() {
  }

  validateName() {
    let re = /^[a-zA-Z ]+$/;
    this.nameError = this.cardName.match(re) ? false : true;
  }

  validateCardNo() {
    this.cardError = !(luhn.validate(this.cardNo.toString()));
  }

  validateMonth() {
    this.monthError = false;
    if (!this.month || this.month.toString().length > 2) {
      this.monthError = true;
      return;
    }
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();
    if (this.year) {
      if (this.year == currentYear) {
        if (this.month <= (currentMonth + 1))
          this.monthError = true;
      }
    }
  }

  validateYear() {
    this.yearError = false;
    if (!this.year || this.year.toString().length != 4) {
      this.yearError = true;
      return;
    }
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();
    if (this.year == currentYear) {
      if (this.month && this.month <= (currentMonth + 1))
        this.monthError = true;
    } else if (this.year < currentYear) {
      this.yearError = true;
    }
  }

  validateCvv() {
    this.cvvError = false;
    if (!this.cvv || this.cvv.toString().length > 4) {
      this.cvvError = true;
      return;
    }
    var re = /^[0-9]{3,4}$/;
    this.cvvError = this.cvv.toString().match(re) ? false : true;
  }

  validate() {
    if (this.cardError || this.nameError || this.monthError || this.yearError || this.cvvError)
      return true;
    else if (!this.cardNo || !this.cardName || !this.month || !this.year || !this.cvv)
      return true;
    else
      return false;
  }

  onSubmit() {
    this.paymentSuccess.emit(true);
  }
}
