import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CovidDataService } from '../services/covid-data.service';
import { RefresherCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab1Page implements OnInit {
  canadaData: any = null;
  detailedData: any[] = [];
  selectedDate: string = '';
  loading = true;
  error: string | null = null;

  constructor(private covidDataService: CovidDataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = null;
    this.covidDataService.getCanadaSummary().subscribe({
      next: (data) => {
        this.detailedData = data;
        if (data && data.length > 0) {
          // Set initial selected date to the most recent date
          this.selectedDate = data[0].date;
          this.canadaData = data[0];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading Canada data:', err);
        this.error = 'Failed to load data. Please try again.';
        this.loading = false;
      }
    });
  }

  onDateChange(event: any) {
    const selectedData = this.detailedData.find(item => item.date === this.selectedDate);
    if (selectedData) {
      this.canadaData = selectedData;
    }
  }

  refresh(event: RefresherCustomEvent) {
    this.covidDataService.clearCache();
    this.loadData();
    event.target.complete();
  }
}
