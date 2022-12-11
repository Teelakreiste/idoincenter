import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CompanyI } from 'src/app/models/company.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {

  private companyInfo: CompanyI = {
    uid: null,
    name: null,
    description: null,
    logo: null,
    email: null,
    address: null,
    country: null,
    city: null,
    state: null,
    zip: null,
    phone: null,
    fax: null,
    website: null,
    facebook: null,
    twitter: null,
    instagram: null
  }

  companyInfoForm: FormGroup;
  imgSrc: string;
  imageUrl: string = '';
  private selectedImage: any = null;

  constructor(private firebaseService: FirebaseService,
    private imageService: ImageService,
    private alertsService: AlertsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.companyInfoForm = this.createFormGroup()
  }

  ngOnInit(): void {
    this.getCompanyInfo();
  }
  
  getCompanyInfo() {
    const path = 'companyInfo';
    const uid = 'iuO7xPy64jtjCBBFfeM1'
    this.firebaseService.getDocumentById<CompanyI>(path, uid).subscribe(data => {
      if (data) {
        this.companyInfo = data;
        this.updateForm(this.companyInfo);
      }  else {
        const resp = this.firebaseService.createDocument(this.companyInfo, path, uid);
        if (resp) {
          console.log('Company info created');
        }
      }
    });
  }

  createFormGroup() {
    return this.formBuilder.group({
      name: new FormControl(''),
      description: new FormControl(''),
      logo: new FormControl(''),
      email: new FormControl(''),
      address: new FormControl(''),
      country: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl(''),
      phone: new FormControl(''),
      fax: new FormControl(''),
      website: new FormControl(''),
      facebook: new FormControl(''),
      twitter: new FormControl(''),
      instagram: new FormControl('')
    });
  }

  updateForm(data: CompanyI) {
    this.imgSrc = data.logo;
    this.imageUrl = data.logo;
    this.companyInfoForm = this.formBuilder.group({
      name: new FormControl(data.name),
      description: new FormControl(data.description),
      logo: new FormControl(''),
      email: new FormControl(data.email),
      address: new FormControl(data.address),
      country: new FormControl(data.country),
      city: new FormControl(data.city),
      state: new FormControl(data.state),
      zip: new FormControl(data.zip),
      phone: new FormControl(data.phone),
      fax: new FormControl(data.fax),
      website: new FormControl(data.website),
      facebook: new FormControl(data.facebook),
      twitter: new FormControl(data.twitter),
      instagram: new FormControl(data.instagram)
    });
  }

  submitForm() {
    if (this.companyInfoForm.valid) {
      this.updateImage();
    }
  }

  resetForm() {
    this.companyInfoForm.reset();
    this.updateForm(this.companyInfo);
  }

  setCompanyInfo(img: string) {
    this.companyInfo.name = this.companyInfoForm.get('name').value;
    this.companyInfo.description = this.companyInfoForm.get('description').value;
    this.companyInfo.logo = img;
    this.companyInfo.email = this.companyInfoForm.get('email').value;
    this.companyInfo.address = this.companyInfoForm.get('address').value;
    this.companyInfo.country = this.companyInfoForm.get('country').value;
    this.companyInfo.city = this.companyInfoForm.get('city').value;
    this.companyInfo.state = this.companyInfoForm.get('state').value;
    this.companyInfo.zip = this.companyInfoForm.get('zip').value;
    this.companyInfo.phone = this.companyInfoForm.get('phone').value;
    this.companyInfo.fax = this.companyInfoForm.get('fax').value;
    this.companyInfo.website = this.companyInfoForm.get('website').value;
    this.companyInfo.facebook = this.companyInfoForm.get('facebook').value;
    this.companyInfo.twitter = this.companyInfoForm.get('twitter').value;
    this.companyInfo.instagram = this.companyInfoForm.get('instagram').value;
  }

  updateCompany(img: string) {
    console.log('update company');
    const path = 'companyInfo';
    this.companyInfoForm.value.uid = 'iuO7xPy64jtjCBBFfeM1'
    this.companyInfoForm.value.photoURL = img;
    this.setCompanyInfo(img);
    const resp = this.firebaseService.updateDocument(this.companyInfo, path, this.companyInfoForm.value.uid);
    if (resp) {
      this.alertsService.messagePosition('Company info created successfully', 'success', 'top-end', 1500);
    }
  }

  updateImage() {
    if (this.selectedImage != null) {
      var filePath = `users/${this.companyInfoForm.value.uid}/${this.companyInfoForm.value.name}-${new Date().getTime()}`;
      const fileRef = this.imageService.getRef(filePath);
      if (this.imageUrl != '' && this.imageUrl != null) {
        this.imageService.deleteImageByUrl(this.imageUrl);
      }
      this.imageService.uploadImage(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            // this.index = true;
            this.companyInfoForm['logo'] = url;
            this.updateCompany(url);
          });
        })
      ).subscribe();
    } else {
      this.updateCompany(this.imageUrl);
    }
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

  back() {
    window.history.back();
  }

  get name() { return this.companyInfoForm.get('name'); }
  get description() { return this.companyInfoForm.get('description'); }
  get logo() { return this.companyInfoForm.get('logo'); }
  get email() { return this.companyInfoForm.get('email'); }
  get address() { return this.companyInfoForm.get('address'); }
  get country() { return this.companyInfoForm.get('country'); }
  get city() { return this.companyInfoForm.get('city'); }
  get state() { return this.companyInfoForm.get('state'); }
  get zip() { return this.companyInfoForm.get('zip'); }
  get phone() { return this.companyInfoForm.get('phone'); }
  get fax() { return this.companyInfoForm.get('fax'); }
  get website() { return this.companyInfoForm.get('website'); }
  get facebook() { return this.companyInfoForm.get('facebook'); }
  get twitter() { return this.companyInfoForm.get('twitter'); }
  get instagram() { return this.companyInfoForm.get('instagram'); }
}
