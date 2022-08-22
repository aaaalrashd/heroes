import {Component, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HeroesService} from './heroes.service';
import {Params, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';
import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd/i18n';
import {HttpParams} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {DropDown, Users} from "./heroes.model";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit, OnChanges {
  error = '';
  isLoading = false;
  filterForm: FormGroup;
  errorMsg: string;
  isWrong = false;
  dataSet: Users[] = [];
  listOfName: Users[] = [];
  nameArray: DropDown[] = [];
  searchAddress: string;
  listOfSearchName: string[] = [];
  sortName: string | null = null;
  sortValue: string | null = null;
  searchValue: string;
  listOfData: Users[] = [];
  searchInput: string;
  paramName: string;
  paramCompany: string;
  paramCity: string;
  paramEmail: string;
  paramPhone: string;
  paramDate: string;
  initialsParams: Params;
  filterParams: Params;
  countries: Array<{ label: string; value: string }> = [];
  selectedValue = null;
  isCollapsed = false;
  isMobile = false;
  constructor(private titleService: Title, private i18n: NzI18nService, private fb: FormBuilder,
              private heroService: HeroesService, private router: Router,
              private activatedRoute: ActivatedRoute, private datePipe: DatePipe) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    // @ts-ignore
    const params = Object.fromEntries(urlSearchParams.entries());
    this.initialsParams = params;
    this.titleService.setTitle('Heroes');

  }

  ngOnInit() {
    this.isLoading = true;
    this.i18n.setLocale(en_US);
    if (window.screen.width < 1000) { // 768px portrait
      this.isMobile = true;
    }
    this.getCountries();
    this.paramName = this.activatedRoute.snapshot.queryParams.name_eq;
    this.paramEmail = this.activatedRoute.snapshot.queryParams.email_eq;
    this.paramCompany = this.activatedRoute.snapshot.queryParams.company_eq;
    this.paramPhone = this.activatedRoute.snapshot.queryParams.phone_eq;
    this.paramCity = this.activatedRoute.snapshot.queryParams.country_eq;
    this.paramDate = this.datePipe.transform(this.activatedRoute.snapshot.queryParams.date_eq, 'y-MM-dd');
    this.selectedValue = this.paramCity;
    console.log(Object.keys(this.initialsParams));
    if (Object.keys(this.initialsParams).length > 0) {
      console.log('kkk');
      this.heroService.getUsersByName(this.initialsParams).subscribe(
          res => {
            res.forEach((e, i = 0) => {
              this.heroService.getByCode(res[i].country).subscribe(response => {
                e.commonCountryName = response[0].name.common;
              });
            });
            this.isLoading = false;
            console.log(res);
            this.dataSet = res;
          },
          err => {
            this.isLoading = false;
            this.validateAllFormFields(this.filterForm);
            this.isWrong = true;
            this.errorMsg = err.value.error.message;
            for (const i in this.filterForm.controls) {
              this.filterForm.controls[i].markAsDirty();
              this.filterForm.controls[i].updateValueAndValidity();
            }

          },
          () => {
            this.isLoading = false;

          }
        );
    } else if (Object.keys(this.initialsParams).length <= 0) {
      this.getAllTargets();

    }
    this.filterForm = this.fb.group({
      name_eq: [null, ],
      email_eq: [null, ],
      phone_eq: [null, ],
      date_eq: [null, ],
      country_eq: [null, ],
      company_eq: [null, ],
    });

  }

  getCountries = () => {
    this.heroService.getCountries().subscribe(
      res => {
        res.forEach((country) => {
          this.countries.push({label: country.name.common, value: country.cioc});
        } );
      });
}
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  onChange(result: Date) {
    this.filterForm.controls.date_eq.setValue(this.datePipe.transform(result, 'y-MM-dd'));
  }
  checkSearch(searchInput) {
    this.isLoading = true;
    this.filterForm.reset();
    if (searchInput && searchInput.length > 0) {
      const params = new HttpParams().set('name_eq', searchInput);
      console.log(params);
      this.router.navigate(
        ['/heroes'],
        {queryParams: {name_eq : params.get('name_eq')}});
      this.heroService.getUsersByName(params).subscribe(
        res => {
          res.forEach((e, i = 0) => {
            this.heroService.getByCode(res[i].country).subscribe(response => {
              e.commonCountryName = response[0].name.common;
            });
          });
          console.log(res);
          this.dataSet = res;
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
          this.validateAllFormFields(this.filterForm);
          this.isWrong = true;
          this.errorMsg = err.value.error.message;
          for (const i in this.filterForm.controls) {
            this.filterForm.controls[i].markAsDirty();
            this.filterForm.controls[i].updateValueAndValidity();
          }

        },
        () => {
          this.isLoading = false;

        }
      );
    } else {
      this.isLoading = true;

      this.router.navigate(
        ['/heroes']);
      this.getAllTargets();
    }
  }
  filter(listOfSearchName: string[], searchAddress: string): void {
    this.listOfSearchName = listOfSearchName;
    this.searchAddress = searchAddress;
    this.search();
  }

  search(): void {
    const filterFunc = (item) =>
      (this.searchAddress ? item.address.indexOf(this.searchAddress) !== -1 : true) &&
      (this.listOfSearchName.length
        ? this.listOfSearchName.some((name) => item.name.indexOf(name) !== -1)
        : true) &&
      (this.searchValue ? item.name.indexOf(this.searchValue) !== -1 : true);

    const data = this.listOfData.filter((item) => filterFunc(item));

    if (this.sortName && this.sortValue) {
      this.dataSet = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.dataSet = data;
    }
  }

  login() {

    if (this.filterForm.invalid) {
      this.validateAllFormFields(this.filterForm);
    }

    if (this.filterForm.valid) {
      this.filterForm.controls.date_eq.setValue(this.datePipe.transform(this.filterForm.controls.date_eq.value, 'y-MM-dd'))
      this.isLoading = true;
      console.log(this.filterForm.controls);
      this.router.navigate(
        ['/heroes'],
        // tslint:disable-next-line:max-line-length
        { queryParams: this.filterParams }
      );
      this.heroService.getUsersByFilter(this.filterParams).subscribe(
      res => {
        res.forEach((e, i = 0) => {
          this.heroService.getByCode(res[i].country).subscribe(response => {
            e.commonCountryName = response[0].name.common;
          });
        });
        this.isLoading = false;
        console.log(res);
        this.dataSet = res;
      },
      err => {
        this.isLoading = false;
        this.validateAllFormFields(this.filterForm);
        this.isWrong = true;
        this.errorMsg = err.value.error.message;
        // tslint:disable-next-line:forin
        for (const i in this.filterForm.controls) {
          this.filterForm.controls[i].markAsDirty();
          this.filterForm.controls[i].updateValueAndValidity();
        }

      },
      () => {
        this.isLoading = false;

      }
    );
    }
}


ss(value) {
this.heroService.getByCode(value).subscribe(
  (res) => {
    console.log(res[0].cioc);
    return res[0].cioc;
  });
  }

  getAllTargets() {
    this.heroService.getAllUsers().subscribe(
      (res) => {
        this.isLoading = true;
        console.log(res);
        res.forEach((e, i = 0) => {
          this.heroService.getByCode(res[i].country).subscribe(response => {
            e.commonCountryName = response[0].name.common;
          });
        });
        this.listOfData = res;
        console.log(this.listOfData);
        this.dataSet = [...this.listOfData];

        console.log(this.dataSet);
        res.forEach((x, i = 0) => {
          this.nameArray.push({
            text: this.dataSet[i].name,
            value: this.dataSet[i].name,
          });
          this.listOfName = this.nameArray.reduce((unique, o) => {
            // @ts-ignore
            if (!unique.some((obj) => obj.text === o.text && obj.value === o.value)) {
              unique.push(o);
            }
            return unique;
          }, []);
        });
        console.log(this.listOfName);
      }, err => {

      }, () => {
        this.isLoading = false;
      }

  );

  }

  validateAllFormFields(formGroup: FormGroup) {

    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  ngOnChanges(): void {
    this.filterForm.valueChanges.subscribe((value) => {
      for (const key in value) {
        if (value[key] === undefined || value[key] === null || value[key] === '') {
          delete value[key];
        }
      }
      this.filterParams = value;

    });
  }
  submitForm(): void {
    this.ngOnChanges();
    setTimeout(() => {
      this.login();

    }, 1000);
    for (const i in this.filterForm.controls) {
      this.filterForm.controls[i].markAsDirty();
      this.filterForm.controls[i].updateValueAndValidity();
    }

  }

}
