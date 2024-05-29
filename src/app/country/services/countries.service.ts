import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';
import { Observable, combineLatest, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1'

  private _regions: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania]

  constructor(
    private http: HttpClient
  ) { }

  get regions() {
    return [...this._regions]
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if (!region) return of([])

      const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`

    return this.http.get<Country[]>(url).pipe(
      map(countries => countries.map(country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders || []
      }))),
      tap(res => console.log({res}))
    )
  }

  getCountry(alpha: string): Observable<SmallCountry> {
    const url = `${this.baseUrl}/alpha/${alpha}?fields=cca3,name,borders`

    return this.http.get<Country>(url)
      .pipe(
        map(contry => ({
          name: contry.name.common,
          cca3: contry.cca3,
          borders: contry.borders ?? []
        }))
      )
  }

  getContriesBorders(borders: string[]): Observable<SmallCountry[]> {
    if( !borders || borders.length === 0) return of([])

      const countriesRequests: Observable<SmallCountry>[] = []

    borders.forEach(code => {
      const request = this.getCountry(code)
      countriesRequests.push(request)
    })

    return combineLatest( countriesRequests )

  }

}
