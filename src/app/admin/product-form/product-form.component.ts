import { Component } from '@angular/core';
import { CategoryService } from '../../category.service';
import { Observable,take } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductCardComponent } from '../../product-card/product-card.component';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [NgFor,CommonModule,FormsModule,NgIf,ProductCardComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  categories$: Observable<any> | undefined;
  urlPattern: string = "https?://.+\..+";
  id;
  product: Product = {
    title: '', price: 0, category: '', imageUrl: '',
    $key: ''
  };
  
constructor(
  private route:ActivatedRoute,
  private router:Router,
  private categoryService:CategoryService,
  private productService:ProductService){

  this.categories$=categoryService.getCategories();
  this.id=this.route.snapshot.paramMap.get('id');
  if (this.id) {
    this.productService.get(this.id).pipe(take(1)).subscribe((p: Product | null) => {
      if (p) {
        this.product = p;
      }
    });
  }
}

save(product: any){
  if(this.id) this.productService.update(this.id,product);
  else this.productService.create(product);
  this.router.navigate(['/admin/products']);
}

delete(){
  if(!confirm('Are you sure you want to delete this product?')) return;
  this.productService.delete(this.id?? '');
  this.router.navigate(['/admin/products']);

}

}
