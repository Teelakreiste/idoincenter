import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../services/alerts.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,
    private alerts: AlertsService) {
    this.authService.stateUser().subscribe(user => {
      if (!user) {
      }
    });
  }


  ngOnInit(): void {
  }

}
