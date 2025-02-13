import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CovidDataService } from '../services/covid-data.service';

export interface DetailedRecord {
  date: string;
  total_cases: number;
  new_cases: number;
  resolved_cases: number;
  deaths: number;
  hospitalized: number;
  icu: number;
  ventilator: number;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab3Page implements OnInit {
  record: DetailedRecord | null = null;

  constructor(
    private route: ActivatedRoute,
    private covidDataService: CovidDataService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['record']) {
        this.record = JSON.parse(params['record']);
      }
    });
  }
}
