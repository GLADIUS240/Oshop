import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../product.service';
import { Subscription, Subject } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { Product } from '../../models/product';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables'; 

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink, NgFor, CommonModule, DataTablesModule], 
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Product[] | undefined;
  filteredProducts: any[] | undefined;
  subscription: Subscription | undefined;
  dtOptions: Config = {};

  constructor(private productService: ProductService) {
    
    this.subscription = this.productService.getProducts().subscribe(products => {
      this.filteredProducts = this.products = products;
    });
  }


  ngOnInit(): void {
    this.dtOptions = {
      serverSide: true,
      columns: [
        {
          title: "Title",
          data: "p.title",
        },
        {
          title: "Price",
          data: "p.price",
        }
      ],
    };
  }
  

  filter(query: string): void {
    this.filteredProducts = query ? 
      this.products?.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    
  }
}
