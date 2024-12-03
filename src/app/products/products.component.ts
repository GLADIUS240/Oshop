import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CategoryService } from '../category.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../models/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,NgFor,NgIf,RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products: Product[]=[];
  filteredProducts:Product[]=[];
  categories$: any;
  category!: String | null;

  constructor(
    route:ActivatedRoute,
    private productService:ProductService, 
    categoryService:CategoryService){
    productService.getProducts().subscribe(products=>{
      this.products=products;

      route.queryParamMap.subscribe(params=>{
        this.category=params.get('category');
  
        this.filteredProducts=(this.category)?
        this.products.filter(p=>p.category===this.category):
        this.products;
      });
    });
    this.categories$=categoryService.getCategories();

   
  }
}
