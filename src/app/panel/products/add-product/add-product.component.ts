import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Manufacturer } from 'src/app/models/manufacturer.model';
import { CategoryService } from 'src/app/services/category.service';
import { ImageService } from 'src/app/services/image.service';
import { ManufacturerService } from 'src/app/services/manufacturer.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  addProductForm: FormGroup;
  private index = false;
  categories: Category[];
  manufacturers: Manufacturer[];
  imgSrc: string;
  private selectedImage: any = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private imageService: ImageService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService) {
    this.getCategories();
    this.getManufacturers();
    this.addProductForm = this.createFormGroup();
  }

  ngOnInit(): void {
  }

  createFormGroup() {
    return this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]),
      price: new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999999)]),
      manufacturer: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      stock: new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999999)]),
      date: new FormControl('')
    });
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = '';
      this.selectedImage = null;
    }
  }

  getDateNow() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((category) => {
      this.categories = category.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Category
        }
      })
    });
  }

  getManufacturers() {
    this.manufacturerService.getManufacturers().subscribe((manufacturer) => {
      this.manufacturers = manufacturer.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Manufacturer
        }
      })
    });
  }


  submit() {
    if (this.addProductForm.valid && !this.index) {
      var filePath = `products/${this.addProductForm.value.category}/${this.addProductForm.value.manufacturer}/${this.addProductForm.value.name.replace(" ","_")}-${new Date().getTime()}`;
      const fileRef = this.imageService.getRef(filePath);

      this.imageService.uploadImage(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.index = true;
            this.addProductForm['image'] = url;
            this.createProduct(url);
          });
        })
      ).subscribe();
    }
  }

  createProduct(url: string) {
    this.addProductForm.value.image = url;
    this.addProductForm.value.date = this.getDateNow();
    this.productService.createProduct(this.addProductForm.value).then(() => {
      this.resetForm();
    }).catch((error) => {
      this.index = false;
      window.alert(error.message);
    });
  }

  resetForm() {
    this.index = false;
    this.addProductForm.reset();
    this.imgSrc = '';
    this.selectedImage = null;
  }

  back() {
    window.history.back();
  }

  get name() {
    return this.addProductForm.get('name');
  }

  get description() {
    return this.addProductForm.get('description');
  }

  get price() {
    return this.addProductForm.get('price');
  }

  get manufacturer() {
    return this.addProductForm.get('manufacturer');
  }

  get category() {
    return this.addProductForm.get('category');
  }

  get image() {
    return this.addProductForm.get('image');
  }

  get stock() {
    return this.addProductForm.get('stock');
  }
}
