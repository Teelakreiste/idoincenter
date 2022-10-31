import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  addCategoryForm: FormGroup;
  private index = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private categoryService: CategoryService) {
    this.addCategoryForm = this.createFormGroup();
  }

  ngOnInit(): void {
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
    if (this.addCategoryForm.valid && !this.index) {
      this.index = true;
      this.addCategoryForm.value.createdAt = this.getDateNow();
      this.addCategoryForm.value.updatedAt = this.getDateNow();
      (this.addCategoryForm.value.status) ? this.addCategoryForm.value.status = true : this.addCategoryForm.value.status = false;
      this.categoryService.createCategory(this.addCategoryForm.value).then(() => {
        this.resetForm();
      }).catch((error) => {
        this.index = false;
        window.alert(error.message);
      });
    }
  }

  resetForm() {
    this.index = false;
    this.addCategoryForm.reset();
  }

  back() {
    window.history.back();
  }

  get name() {
    return this.addCategoryForm.get('name');
  }

  get description() {
    return this.addCategoryForm.get('description');
  }
}
