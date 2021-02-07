import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ProductService} from './product.service';
import {combineLatest, EMPTY, Subject} from 'rxjs';
import {catchError, map, startWith} from 'rxjs/operators';
import {ProductCategoryService} from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  // Subject is used to combine Action and Data streams
  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // $ in the name indicates that variable is observable
  products$ = combineLatest([
    this.productService.productWithCategory$,
    this.categorySelectedAction$
      // To use initial value add 0 to the stream
      .pipe(
        startWith(0)
      )
  ])
    .pipe(
      map(([products, selectedCategoryId]) =>
        products.filter(product =>
          selectedCategoryId ? product.categoryId === selectedCategoryId : true)
      ),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    // Submit selected categoryId into action stream
    this.categorySelectedSubject.next(+categoryId);
  }
}
