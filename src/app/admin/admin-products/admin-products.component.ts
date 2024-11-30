import { Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../product.service';
import { map, Observable, Subscription } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink,NgFor,CommonModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnDestroy {
  products: Product[] | undefined ;
  filteredProducts: any[] | undefined;
  subscription:Subscription | undefined;
  constructor(private productService:ProductService){
    this.subscription=this.productService.getProducts().subscribe(products=>this.filteredProducts=this.products=products);
  }

  filter(query:string){
    this.filteredProducts=(query)?
    this.products?.filter(p=>p.title.toLowerCase().includes(query.toLowerCase())) :
    this.products;
  }

  ngOnDestroy(): void {
      this.subscription?.unsubscribe();
  }

}
