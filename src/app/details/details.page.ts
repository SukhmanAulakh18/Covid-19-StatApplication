import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CovidDataService } from '../services/covid-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetailsPage implements OnInit, OnDestroy {
  phuData: any;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private covidDataService: CovidDataService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get the data passed from the Ontario tab
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.phuData = navigation.extras.state['phuData'];
    }

    // Handle hardware back button
    const backHandler = () => {
      this.goBack();
    };
    document.addEventListener('backbutton', backHandler, false);
  }

  ngOnDestroy() {
    // Remove the back button listener to prevent memory leaks
    document.removeEventListener('backbutton', () => {}, false);
  }

  sendMessage() {
    const trimmedMessage = this.message.trim();
    if (trimmedMessage) {
      console.log('Sending message:', trimmedMessage);
      this.covidDataService.setOntarioMessage(trimmedMessage);
      this.message = ''; // Clear the input after sending
    }
  }

  goBack() {
    this.router.navigate(['/tabs/ontario']);
  }
}
