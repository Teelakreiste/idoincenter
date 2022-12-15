import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuardGuard } from './guards/admin-guard.guard';
import { LoggedGuardGuard } from './guards/logged-guard.guard';
import { SecurityGuardGuard } from './guards/security-guard.guard';
import { HomeComponent } from './home/home.component';
import { InfoProductComponent } from './info-product/info-product.component';
import { NoFoundComponent } from './no-found/no-found.component';
import { AdminComponent } from './panel/admin/admin.component';
import { AddCategoryComponent } from './panel/categories/add-category/add-category.component';
import { EditCategoryComponent } from './panel/categories/edit-category/edit-category.component';
import { AddManufacturerComponent } from './panel/manufacturers/add-manufacturer/add-manufacturer.component';
import { EditManufacturerComponent } from './panel/manufacturers/edit-manufacturer/edit-manufacturer.component';
import { AddProductComponent } from './panel/products/add-product/add-product.component';
import { EditProductComponent } from './panel/products/edit-product/edit-product.component';
import { ForgotPasswordComponent } from './session/forgot-password/forgot-password.component';
import { SignInComponent } from './session/sign-in/sign-in.component';
import { SignUpComponent } from './session/sign-up/sign-up.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { ProfileSettingsComponent } from './user/profile-settings/profile-settings.component';
import { MainGuardGuard } from './guards/main-guard.guard';
import { ShoppingCartComponent } from './user/shopping-cart/shopping-cart.component';
import { CompanyInfoComponent } from './panel/company-info/company-info.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PaymentOptionComponent } from './payment/payment-option/payment-option.component';



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [MainGuardGuard] },
  { path: 'view/info/product/:id', component: InfoProductComponent, canActivate: [MainGuardGuard] },
  { path: 'panel/admin', component: AdminComponent, canActivate: [AdminGuardGuard] },
  { path: 'panel/admin/categories/add', component: AddCategoryComponent, canActivate: [AdminGuardGuard] },
  { path: 'panel/admin/categories/edit/:id', component: EditCategoryComponent, canActivate: [AdminGuardGuard] },
  { path: 'panel/admin/manufacturers/add', component: AddManufacturerComponent, canActivate: [AdminGuardGuard] },
  { path: 'panel/admin/manufacturers/edit/:id', component: EditManufacturerComponent, canActivate: [AdminGuardGuard] },
  { path: 'panel/admin/products/add', component: AddProductComponent, canActivate: [AdminGuardGuard] },
  { path: 'panel/admin/products/edit/:id', component: EditProductComponent, canActivate: [AdminGuardGuard] },
  { path: 'panel/admin/users/add', component: UpdateUserComponent, canActivate: [AdminGuardGuard] },
  { path: 'panel/admin/users/edit/:id', component: ProfileSettingsComponent, canActivate: [AdminGuardGuard] },
  { path: 'panel/admin/company/info', component: CompanyInfoComponent, canActivate: [AdminGuardGuard]},
  { path: 'session/sing-in', component: SignInComponent, canActivate: [SecurityGuardGuard] },
  { path: 'session/sing-up', component: SignUpComponent, canActivate: [SecurityGuardGuard] },
  { path: 'session/forgot-password', component: ForgotPasswordComponent, canActivate: [SecurityGuardGuard] },
  { path: 'user/profile/settings/:id', component: ProfileSettingsComponent, canActivate: [LoggedGuardGuard] },
  { path: 'user/shopping-cart', component: ShoppingCartComponent, canActivate: [LoggedGuardGuard] },
  { path: 'checkout/invoice/:id', component: InvoiceComponent, canActivate: [LoggedGuardGuard]},
  { path: 'checkout/payment/payment-options', component: PaymentOptionComponent, canActivate: [LoggedGuardGuard]},
  { path: 'not-found', component: NoFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
