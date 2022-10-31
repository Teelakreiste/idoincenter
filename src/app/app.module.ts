import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SwiperModule } from 'swiper/angular';

import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProductsComponent } from './products/products.component';
import { InfoProductComponent } from './info-product/info-product.component';
import { NoFoundComponent } from './no-found/no-found.component';
import { BrokenImgDirective } from './directives/broken-img.directive';
import { AdminComponent } from './panel/admin/admin.component';
import { AddCategoryComponent } from './panel/categories/add-category/add-category.component';
import { ShowCategoryComponent } from './panel/categories/show-category/show-category.component';
import { EditCategoryComponent } from './panel/categories/edit-category/edit-category.component';
import { AddManufacturerComponent } from './panel/manufacturers/add-manufacturer/add-manufacturer.component';
import { EditManufacturerComponent } from './panel/manufacturers/edit-manufacturer/edit-manufacturer.component';
import { ShowManufacturersComponent } from './panel/manufacturers/show-manufacturers/show-manufacturers.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ProductsComponent,
    InfoProductComponent,
    NoFoundComponent,
    BrokenImgDirective,
    AdminComponent,
    AddCategoryComponent,
    ShowCategoryComponent,
    EditCategoryComponent,
    AddManufacturerComponent,
    EditManufacturerComponent,
    ShowManufacturersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SwiperModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
