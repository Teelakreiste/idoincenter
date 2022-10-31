import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManufacturerService } from 'src/app/services/manufacturer.service';

@Component({
  selector: 'app-edit-manufacturer',
  templateUrl: './edit-manufacturer.component.html',
  styleUrls: ['./edit-manufacturer.component.css']
})
export class EditManufacturerComponent implements OnInit {

  editManufacturerForm: FormGroup;
  private index = false;

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private manufacturerService: ManufacturerService) {
    this.editManufacturerForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.manufacturerService.getManufacturer(this.getId()).subscribe((category) => {
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
    this.editManufacturerForm = this.formBuilder.group({
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
    if (this.editManufacturerForm.valid) {
      this.editManufacturerForm.value.updatedAt = this.getDateNow();
      this.manufacturerService.updateManufacturer(this.getId(), this.editManufacturerForm.value).then(() => {
        this.router.navigate(['/panel/admin']);
      });
    }
  }

  back() {
    window.history.back();
  }

  get name() {
    return this.editManufacturerForm.get('name');
  }

  get description() {
    return this.editManufacturerForm.get('description');
  }

  get status() {
    return this.editManufacturerForm.get('status');
  }
}
