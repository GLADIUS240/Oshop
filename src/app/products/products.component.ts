import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CategoryService } from '../category.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../models/product';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,NgFor,NgIf,RouterLink,ProductFilterComponent,ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  products: Product[]=[];
  filteredProducts:Product[]=[];
  cart: any = {}; // Initialize as an empty object

  loading: boolean = true;
  
  category!: String | null;

  constructor(
    private shoppingCartService:ShoppingCartService,
    route:ActivatedRoute,
    productService:ProductService){
     

    productService.getProducts().subscribe(products=>{
      this.products=products;

      route.queryParamMap.subscribe(params=>{
        this.category=params.get('category');
  
        this.filteredProducts=(this.category)?
        this.products.filter(p=>p.category===this.category):
        this.products;
      });
    });
    

   
  }
  
  async ngOnInit(): Promise<void> { 
    this.cart = await this.shoppingCartService.getCart();
    this.loading = false; // Data has been loaded
  }
  
}
