import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManufacturerService } from 'src/app/services/manufacturer.service';

@Component({
  selector: 'app-add-manufacturer',
  templateUrl: './add-manufacturer.component.html',
  styleUrls: ['./add-manufacturer.component.css']
})
export class AddManufacturerComponent implements OnInit {

  addManufacturerForm: FormGroup;
  private index = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private manufacturerService: ManufacturerService) {
    this.addManufacturerForm = this.createFormGroup();
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
    if (this.addManufacturerForm.valid && !this.index) {
      this.index = true;
      this.addManufacturerForm.value.createdAt = this.getDateNow();
      this.addManufacturerForm.value.updatedAt = this.getDateNow();
      (this.addManufacturerForm.value.status) ? this.addManufacturerForm.value.status = true : this.addManufacturerForm.value.status = false;
      this.manufacturerService.createManufacturer(this.addManufacturerForm.value).then(() => {
        this.resetForm();
      }).catch((error) => {
        this.index = false;
        window.alert(error.message);
      });
    }
  }

  resetForm() {
    this.index = false;
    this.addManufacturerForm.reset();
  }

  back() {
    window.history.back();
  }

  get name() {
    return this.addManufacturerForm.get('name');
  }

  get description() {
    return this.addManufacturerForm.get('description');
  }

}
