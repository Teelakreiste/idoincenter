import { Component, OnInit } from '@angular/core';
import { CompanyI } from '../models/company.model';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  companyInfo: CompanyI = {
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

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.getCompanyInfo();
  }

  getCompanyInfo() {
    const path = 'companyInfo';
    const uid = 'iuO7xPy64jtjCBBFfeM1'
    this.firebaseService.getDocumentById<CompanyI>(path, uid).subscribe(data => {
      if (data) {
        this.companyInfo = data;
      } else {
        const resp = this.firebaseService.createDocument(this.companyInfo, path, uid);
        if (resp) {
          console.log('Company info created');
        }
      }
    });
  }

}
