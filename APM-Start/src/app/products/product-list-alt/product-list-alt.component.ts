import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';

import {BehaviorSubject, EMPTY, Subject, Subscription} from 'rxjs';

import { ProductService } from '../product.service';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';

  // Subject is used to combine Action and Data streams. As we changed changeDetection strategy we should change errorMessage to Subject
  private errorMessageSubject = new Subject<number>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  products$ = this.productService.productWithCategory$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  selectedProduct$ = this.productService.selectedProduct$;
  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
