import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Manufacturer } from 'src/app/models/manufacturer.model';
import { CategoryService } from 'src/app/services/category.service';
import { ImageService } from 'src/app/services/image.service';
import { ManufacturerService } from 'src/app/services/manufacturer.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  editProductForm: FormGroup;
  private index = false;
  categories: Category[];
  manufacturers: Manufacturer[];
  imgSrc: string;
  imageUrl: string = '';
  private selectedImage: any = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private imageService: ImageService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService) {
    this.getCategories();
    this.getManufacturers();
    this.editProductForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.productService.getProduct(this.getId()).subscribe((product) => {
      this.updateForm(product);
    });
  }

  createFormGroup() {
    return this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      price: new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999999)]),
      manufacturer: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      stock: new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999999)]),
      date: new FormControl('')
    });
  }

  updateForm(product: any) {
    this.imgSrc = product.image;
    this.imageUrl = product.image;
    this.editProductForm = this.formBuilder.group({
      name: [product.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [product.description, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      price: [product.price, [Validators.required, Validators.min(0), Validators.max(999999999)]],
      manufacturer: [product.manufacturer, [Validators.required]],
      category: [product.category, [Validators.required]],
      image: [''],
      stock: [product.stock, [Validators.required, Validators.min(0), Validators.max(999999999)]],
      date: [product.date]
    });
  }

  getId() {
    return this.activatedRoute.snapshot.paramMap.get('id');
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
    if (this.editProductForm.valid && !this.index) {
      this.updateImage();
    }
  }

  updateImage() {
    if (this.selectedImage != null) {
      var filePath = `products/${this.editProductForm.value.category}/${this.editProductForm.value.manufacturer}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.imageService.getRef(filePath);
      this.imageService.deleteImageByUrl(this.imageUrl);
      this.imageService.uploadImage(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.index = true;
            this.editProductForm['image'] = url;
            this.updateProduct(url);
          });
        })
      ).subscribe();
    } else {
      this.updateProduct(this.imgSrc);
    }
  }

  updateProduct(url: string) {
    this.editProductForm.value.image = url;
    this.productService.updateProduct(this.getId(), this.editProductForm.value);
    this.router.navigate(['/panel/admin']);
  }

  resetForm() {
    this.index = false;
    this.editProductForm.reset();
    this.imgSrc = '';
    this.selectedImage = null;
  }

  back() {
    window.history.back();
  }

  get name() {
    return this.editProductForm.get('name');
  }

  get description() {
    return this.editProductForm.get('description');
  }

  get price() {
    return this.editProductForm.get('price');
  }

  get manufacturer() {
    return this.editProductForm.get('manufacturer');
  }

  get category() {
    return this.editProductForm.get('category');
  }

  get image() {
    return this.editProductForm.get('image');
  }

  get stock() {
    return this.editProductForm.get('stock');
  }
}
