import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';
import { OntarioData, FatalityData, ProvinceData } from '../models/covid-data.model';

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {
  private ontarioMessageSubject = new BehaviorSubject<string | null>(null);
  public ontarioMessage$ = this.ontarioMessageSubject.asObservable();

  private currentMessage: string | null = null;

  private canadaData$: Observable<any> | null = null;
  private ontarioData$: Observable<any> | null = null;
  private ontarioDetailedData$: Observable<any[]> | null = null;

  constructor(private http: HttpClient) {
    // Load message from local storage on service initialization
    const storedMessage = localStorage.getItem('ontarioMessage');
    console.log('Service Constructor: Stored message:', storedMessage);
    
    if (storedMessage) {
      this.currentMessage = storedMessage;
      this.ontarioMessageSubject.next(storedMessage);
    }
  }

  getCanadaSummary(): Observable<any> {
    if (!this.canadaData$) {
      this.canadaData$ = this.http.get<ProvinceData[]>('assets/data/covid19-download.json').pipe(
        map(data => {
          // Group data by date
          const dateGroups = new Map();
          
          data.forEach(record => {
            if (!dateGroups.has(record.date)) {
              dateGroups.set(record.date, []);
            }
            dateGroups.get(record.date).push(record);
          });

          // Convert to array and sort by date (newest first)
          const dailyData = Array.from(dateGroups.entries())
            .map(([date, provinces]) => {
              const totalCases = provinces.reduce((sum: number, province: ProvinceData) => 
                sum + parseInt(province.totalcases || '0'), 0);
              const newCases = provinces.reduce((sum: number, province: ProvinceData) => 
                sum + parseInt(province.numtotal_last7 || '0'), 0);
              const totalDeaths = provinces.reduce((sum: number, province: ProvinceData) => 
                sum + parseInt(province.numdeaths?.toString() || '0'), 0);
              const newDeaths = provinces.reduce((sum: number, province: ProvinceData) => 
                sum + parseInt(province.numdeaths_last7?.toString() || '0'), 0);

              return {
                date,
                totalCases,
                newCases,
                totalDeaths,
                newDeaths,
                provinces: provinces.map((province: ProvinceData) => ({
                  name: province.prname,
                  totalCases: parseInt(province.totalcases || '0'),
                  newCases: parseInt(province.numtotal_last7 || '0'),
                  deaths: parseInt(province.numdeaths?.toString() || '0'),
                  newDeaths: parseInt(province.numdeaths_last7?.toString() || '0')
                }))
              };
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          return dailyData;
        }),
        shareReplay(1)
      );
    }
    return this.canadaData$;
  }

  getOntarioData(): Observable<any> {
    if (!this.ontarioData$) {
      this.ontarioData$ = this.http.get<OntarioData[]>('assets/data/ontario-status.json').pipe(
        map(data => {
          // Sort data by date in descending order
          const sortedData = [...data].sort((a, b) => 
            new Date(b.FILE_DATE).getTime() - new Date(a.FILE_DATE).getTime()
          );

          // Get the latest data
          const latestData = sortedData[0];
          const phuData = data.filter(item => item.FILE_DATE === latestData.FILE_DATE);

          // Calculate totals from PHU data
          const totalCases = phuData.reduce((sum: number, phu: OntarioData) => 
            sum + parseInt(phu.ACTIVE_CASES || '0') + parseInt(phu.RESOLVED_CASES || '0'), 0);
          const activeCases = phuData.reduce((sum: number, phu: OntarioData) => 
            sum + parseInt(phu.ACTIVE_CASES || '0'), 0);
          const resolvedCases = phuData.reduce((sum: number, phu: OntarioData) => 
            sum + parseInt(phu.RESOLVED_CASES || '0'), 0);
          const deaths = phuData.reduce((sum: number, phu: OntarioData) => 
            sum + parseInt(phu.DEATHS || '0'), 0);

          return {
            date: latestData.FILE_DATE,
            totalCases,
            activeCases,
            resolvedCases,
            deaths,
            phuBreakdown: phuData.map((phu: OntarioData) => ({
              name: phu.PHU_NAME,
              activeCases: parseInt(phu.ACTIVE_CASES || '0'),
              resolvedCases: parseInt(phu.RESOLVED_CASES || '0'),
              deaths: parseInt(phu.DEATHS || '0')
            }))
          };
        }),
        shareReplay(1)
      );
    }
    return this.ontarioData$;
  }

  getOntarioDetailedData(): Observable<any[]> {
    if (!this.ontarioDetailedData$) {
      this.ontarioDetailedData$ = this.http.get<OntarioData[]>('assets/data/ontario-status.json').pipe(
        map(data => {
          // Get all unique dates
          const dates = [...new Set(data.map(item => item.FILE_DATE))]
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

          // For each date, calculate totals
          return dates.map(date => {
            const dayData = data.filter(item => item.FILE_DATE === date);
            return {
              date,
              total_cases: dayData.reduce((sum: number, phu: OntarioData) => 
                sum + parseInt(phu.ACTIVE_CASES || '0') + parseInt(phu.RESOLVED_CASES || '0'), 0),
              active_cases: dayData.reduce((sum: number, phu: OntarioData) => 
                sum + parseInt(phu.ACTIVE_CASES || '0'), 0),
              resolved_cases: dayData.reduce((sum: number, phu: OntarioData) => 
                sum + parseInt(phu.RESOLVED_CASES || '0'), 0),
              deaths: dayData.reduce((sum: number, phu: OntarioData) => 
                sum + parseInt(phu.DEATHS || '0'), 0),
              phu_breakdown: dayData.map((phu: OntarioData) => ({
                name: phu.PHU_NAME,
                active: parseInt(phu.ACTIVE_CASES || '0'),
                resolved: parseInt(phu.RESOLVED_CASES || '0'),
                deaths: parseInt(phu.DEATHS || '0')
              }))
            };
          });
        }),
        shareReplay(1)
      );
    }
    return this.ontarioDetailedData$;
  }

  clearCache() {
    this.canadaData$ = null;
    this.ontarioData$ = null;
    this.ontarioDetailedData$ = null;
  }

  setOntarioMessage(message: string) {
    console.log('Service: Setting message', message);
    this.currentMessage = message;
    // Store message in local storage
    localStorage.setItem('ontarioMessage', message);
    // Ensure message is emitted
    this.ontarioMessageSubject.next(message);
  }

  clearOntarioMessage() {
    console.log('Service: Clearing message');
    this.currentMessage = null;
    // Remove message from local storage
    localStorage.removeItem('ontarioMessage');
    // Ensure null is emitted
    this.ontarioMessageSubject.next(null);
  }

  getCurrentMessage(): string | null {
    console.log('Service: Getting current message', this.currentMessage);
    return this.currentMessage;
  }
}
