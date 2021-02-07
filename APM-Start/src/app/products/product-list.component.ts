import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ProductService} from './product.service';
import {BehaviorSubject, combineLatest, EMPTY, Subject} from 'rxjs';
import {catchError, map, startWith} from 'rxjs/operators';
import {ProductCategoryService} from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  // Subject is used to combine Action and Data streams. As we changed changeDetection strategy we should change errorMessage to Subject
  private errorMessageSubject = new Subject<number>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  // Subject is used to combine Action and Data streams
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // $ in the name indicates that variable is observable
  products$ = combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$
  ])
    .pipe(
      map(([products, selectedCategoryId]) =>
        products.filter(product =>
          selectedCategoryId ? product.categoryId === selectedCategoryId : true)
      ),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    // Submit selected categoryId into action stream
    this.categorySelectedSubject.next(+categoryId);
  }
}
