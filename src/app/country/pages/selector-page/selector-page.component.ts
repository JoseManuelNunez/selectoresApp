import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Country, Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css'
})
export class SelectorPageComponent implements OnInit {

  public contriesByRegion: SmallCountry[] = []
  public borders: SmallCountry[] = []

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })


  constructor(
    private fb: FormBuilder,
    private cs: CountriesService
  ) { }

  ngOnInit(): void {
    this.onRegionChanged()
    this.onCountryChanged()
  }

  get regions(): Region[] {
    return this.cs.regions
  }

  onRegionChanged() {
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap(() => this.myForm.get('country')!.setValue('')),
      switchMap(region => this.cs.getCountriesByRegion(region))
    )
      .subscribe(countries => {
        this.contriesByRegion = countries
      })
  }

  onCountryChanged() {
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap(() => this.myForm.get('border')!.setValue('')),
      filter((value: string) => value.length > 0),
      switchMap(alpha => this.cs.getCountry(alpha)),
      switchMap(country => this.cs.getContriesBorders(country.borders))
    )
      .subscribe(countries => {
        this.borders = countries
      })
  }




}
