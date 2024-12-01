import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../product.service';
import { Subscription, Subject } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { Product } from '../../models/product';
import { DataTableDirective } from 'angular-datatables';
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

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private productService: ProductService) {
    
    this.subscription = this.productService.getProducts().subscribe(products => {
      this.dtTrigger.next({});
      this.filteredProducts = this.products = products;
      
    });
  }

  ngOnInit(): void {
    this.dtOptions = {
      paging: true,
      searching: false,
      ordering: true,
      pageLength: 10,
      responsive: true, 
      autoWidth: true,
      scrollY:'400',
      columnDefs: [
        { 
          targets: 2,  // Target the 3rd column (Edit column)
          orderable: false,
          ordering:false  // Disable sorting for this column
        }
      ],
    };
  }

  filter(query: string): void {
    this.filteredProducts = query ? 
      this.products?.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
    this.dtTrigger.next({}); 
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.dtTrigger.unsubscribe();
  }
}
