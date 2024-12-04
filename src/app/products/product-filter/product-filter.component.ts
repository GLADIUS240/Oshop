import { Component, Input } from '@angular/core';
import { CategoryService } from '../../category.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'product-filter',
  standalone: true,
  imports: [NgFor,CommonModule,RouterModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent {
  categories$: any;
  @Input('category') category: any;
  
  constructor(categoryService:CategoryService){
    this.categories$=categoryService.getCategories();
  }

}
