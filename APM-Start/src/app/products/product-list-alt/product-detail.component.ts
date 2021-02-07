import {ChangeDetectionStrategy, Component} from '@angular/core';

import {ProductService} from '../product.service';
import {catchError, map} from 'rxjs/operators';
import {EMPTY, Subject} from 'rxjs';
import {Product} from '../product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  // Subject is used to combine Action and Data streams. As we changed changeDetection strategy we should change errorMessage to Subject
  private errorMessageSubject = new Subject<number>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  pageTitle$ = this.product$
    .pipe(
      map((p: Product) =>
        p ? `Product Details for: ${p.productName}` : null)
    );

  productSuppliers$ = this.productService.selectedProductSuppliers$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );
  constructor(private productService: ProductService) { }

}
