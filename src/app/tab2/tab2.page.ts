import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CovidDataService } from '../services/covid-data.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab2Page implements OnInit, OnDestroy {
  ontarioData: any = {};
  detailedData: any[] = [];
  selectedDate: string = '';
  loading = true;
  error: string | null = null;
  message: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private covidDataService: CovidDataService, private router: Router, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
    
    // Log initial message state
    console.log('Initial message state:', this.message);

    // Subscribe to messages from details page
    this.subscriptions.push(
      this.covidDataService.ontarioMessage$.subscribe(message => {
        console.log('Tab2: Received message (Subscription):', message);
        
        // Explicitly set message and log
        if (message !== null) {
          this.message = message;
          console.log('Tab2: Message set to:', this.message);
        }
        
        // Force change detection
        this.changeDetectorRef.detectChanges();
      })
    );

    // Check for existing message on init
    const existingMessage = this.covidDataService.getCurrentMessage();
    console.log('Existing message from service:', existingMessage);
    
    if (existingMessage) {
      this.message = existingMessage;
      console.log('Tab2: Set message from existing:', this.message);
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ionViewWillLeave() {
    // Do not clear the message automatically
    // this.covidDataService.clearOntarioMessage();
  }

  clearMessage() {
    console.log('Clearing message');
    this.covidDataService.clearOntarioMessage();
    this.message = null;
    this.changeDetectorRef.detectChanges();
  }

  loadData() {
    this.loading = true;
    this.error = null;
    
    // Load Ontario summary data
    const sub1 = this.covidDataService.getOntarioData().subscribe({
      next: (data) => {
        this.ontarioData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading Ontario data:', err);
        this.error = 'Failed to load Ontario data. Please try again.';
        this.loading = false;
      }
    });
    this.subscriptions.push(sub1);

    // Load detailed records
    const sub2 = this.covidDataService.getOntarioDetailedData().subscribe({
      next: (data) => {
        this.detailedData = data;
        if (data.length > 0) {
          this.selectedDate = data[0].date;
        }
      },
      error: (err) => {
        console.error('Error loading detailed data:', err);
        this.error = 'Failed to load detailed records. Please try again.';
      }
    });
    this.subscriptions.push(sub2);
  }

  getSelectedDateData() {
    return this.detailedData.find(item => item.date === this.selectedDate) || null;
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }

  doRefresh(event: any) {
    this.covidDataService.clearCache();
    this.loadData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  viewPHUDetails(phu: any) {
    this.router.navigate(['/tabs/details'], {
      state: { phuData: phu }
    });
  }
}
