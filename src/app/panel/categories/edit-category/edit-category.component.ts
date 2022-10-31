import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  editCategoryForm: FormGroup;
  private index = false;

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService) {
    this.editCategoryForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.categoryService.getCategory(this.getId()).subscribe((category) => {
      this.updateForm(category);
    });
  }

  getId() {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  createFormGroup() {
    return this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl(null),
      createdAt: new FormControl(null),
      updatedAt: new FormControl(null)
    });
  }

  updateForm(category: any) { 
    this.editCategoryForm = this.formBuilder.group({
      name: new FormControl(category.name, [Validators.required]),
      description: new FormControl(category.description, [Validators.required]),
      status: new FormControl(category.status),
      createdAt: new FormControl(category.createdAt),
      updatedAt: new FormControl(category.updatedAt)
    });
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

  submit() { 
    if (this.editCategoryForm.valid) {
      this.editCategoryForm.value.updatedAt = this.getDateNow();
      this.categoryService.updateCategory(this.getId(), this.editCategoryForm.value).then(() => {
        this.router.navigate(['/panel/admin']);
      });
    }
  }

  back() {
    window.history.back();
  }

  get name() {
    return this.editCategoryForm.get('name');
  }

  get description() {
    return this.editCategoryForm.get('description');
  }

  get status() {
    return this.editCategoryForm.get('status');
  }
}
