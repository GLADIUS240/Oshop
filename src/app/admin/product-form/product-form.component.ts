import { Component, NgModule } from '@angular/core';
import { CategoryService } from '../../category.service';
import { Observable } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [NgFor,CommonModule,FormsModule,NgIf],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  categories$: Observable<any> | undefined
constructor(categoryService:CategoryService,private productService:ProductService){
  this.categories$=categoryService.getCategories();
}
save(product: any){
  this.productService.create(product);
}

}
