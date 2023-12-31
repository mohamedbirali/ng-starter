import { Injectable, computed, effect, signal } from '@angular/core';
import { TProduct } from './state-signal.model';
import { MOCK_PRODUCT } from './data';
import { of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
/**
 * signal
 * computed (combine signalValues)
 * signale.set() // replaces existing value with new one
 * signal.update // update signal based on its value
 * signal.mutate // mutate content, not value itself (NO LONGER SUPPORTED)
 *
 * effect(() => triggerSomeSignalHere)
 *
 * RXJS & Signals
 * toSignal(obs$): Signal;
 * toObservable(Signal): Obs$;
 *
 */
@Injectable()
export class StateSignalService {
  products$ = of(MOCK_PRODUCT);
  product = toSignal(this.products$);

  constructor() {
    effect(() => () => this.totalPrice());
  }

  getListProducts = signal<TProduct[]>(MOCK_PRODUCT);

  totalPrice = computed(() =>
    this.getListProducts().reduce((p1, p2) => +p1 + +p2.price, 0),
  );

  deleteProduct(id: number) {
    this.getListProducts.update((products) =>
      products.filter((product) => product.id !== id),
    );
  }

  #_updateProduct(product: TProduct) {
    this.getListProducts.update((products) =>
      products.map((_product) =>
        _product.id !== product.id ? _product : product,
      ),
    );
  }

  addProduct(product: TProduct) {
    if (!product.id) {
      product.id = Math.round(Math.random() * 20000);

      this.getListProducts.update((products) => [...products, product]);
    } else {
      this.#_updateProduct(product);
    }
  }
}
