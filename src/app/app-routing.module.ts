import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InfoProductComponent } from './info-product/info-product.component';
import { NoFoundComponent } from './no-found/no-found.component';
import { AdminComponent } from './panel/admin/admin.component';
import { AddCategoryComponent } from './panel/categories/add-category/add-category.component';
import { EditCategoryComponent } from './panel/categories/edit-category/edit-category.component';
import { AddManufacturerComponent } from './panel/manufacturers/add-manufacturer/add-manufacturer.component';
import { EditManufacturerComponent } from './panel/manufacturers/edit-manufacturer/edit-manufacturer.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'view/info/product/:id', component: InfoProductComponent },
  { path: 'panel/admin', component: AdminComponent },
  { path: 'panel/admin/categories/add', component: AddCategoryComponent },
  { path: 'panel/admin/categories/edit/:id', component: EditCategoryComponent },
  { path: 'panel/admin/manufacturers/add', component: AddManufacturerComponent },
  { path: 'panel/admin/manufacturers/edit/:id', component: EditManufacturerComponent },
  { path: 'not-found', component: NoFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
