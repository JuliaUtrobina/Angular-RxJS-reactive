import {ChangeDetectionStrategy, Component} from '@angular/core';

import {ProductService} from '../product.service';
import {catchError} from 'rxjs/operators';
import {EMPTY, Subject} from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';

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

  constructor(private productService: ProductService) { }

}
