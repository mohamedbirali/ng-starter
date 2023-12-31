import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { StateSignalService } from './state-signal.service';
import { TProduct } from './state-signal.model';

enum ENUM_PRODUCT_FORM {
  ID = 'id',
  NAME = 'name',
  PRICE = 'price',
}

@Component({
  selector: 'izi-state-signal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './state-signal.component.html',
  providers: [StateSignalService],
})
export class StateSignalComponent {
  // DI
  #_productService = inject(StateSignalService);

  listProduct = this.#_productService.getListProducts;
  totalPrice = this.#_productService.totalPrice;

  // form
  productFormProps = ENUM_PRODUCT_FORM;

  productForm = new FormGroup({
    [this.productFormProps.ID]: new FormControl(),
    [this.productFormProps.NAME]: new FormControl(''),
    [this.productFormProps.PRICE]: new FormControl(0),
  });

  addProduct() {
    this.#_productService.addProduct(this.productForm.value as TProduct);

    this.productForm.reset();
    this.productForm.updateValueAndValidity();
  }

  updateForm(product: TProduct) {
    this.productForm.patchValue(product);
  }

  deleteProduct(id: number) {
    this.#_productService.deleteProduct(id);
  }
}
