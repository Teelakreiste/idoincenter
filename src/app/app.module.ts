import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SwiperModule } from 'swiper/angular';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxPrintModule } from 'ngx-print';

import { HttpClientModule } from '@angular/common/http';

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
import { AddProductComponent } from './panel/products/add-product/add-product.component';
import { EditProductComponent } from './panel/products/edit-product/edit-product.component';
import { ShowProductsComponent } from './panel/products/show-products/show-products.component';
import { SignInComponent } from './session/sign-in/sign-in.component';
import { SignUpComponent } from './session/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './session/forgot-password/forgot-password.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { ProfileSettingsComponent } from './user/profile-settings/profile-settings.component';
import { ShowUsersComponent } from './panel/users/show-users/show-users.component';
import { ShoppingCartComponent } from './user/shopping-cart/shopping-cart.component';
import { CompanyInfoComponent } from './panel/company-info/company-info.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PaymentOptionComponent } from './payment/payment-option/payment-option.component';

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
    ShowManufacturersComponent,
    AddProductComponent,
    EditProductComponent,
    ShowProductsComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    UpdateUserComponent,
    ProfileSettingsComponent,
    ShowUsersComponent,
    ShoppingCartComponent,
    CompanyInfoComponent,
    InvoiceComponent,
    PaymentOptionComponent,
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
    ReactiveFormsModule,
    SweetAlert2Module,
    HttpClientModule,
    NgxPrintModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
