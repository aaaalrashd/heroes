import {NgModule} from '@angular/core';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import {HeroesComponent} from './heroes.component';
import {HeroesRoutingModule} from './heroes-routing.module';
import {HeroesService} from './heroes.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  NzDatePickerModule,
  NzDividerModule,
  NzFormModule,
  NzLayoutModule, NzMenuModule,
  NzSelectModule,
  NzTableModule
} from 'ng-zorro-antd';
import { NzButtonModule } from 'ng-zorro-antd';
import { NzCheckboxModule } from 'ng-zorro-antd';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SharedModule } from '../shared/shared.module';
import en from '@angular/common/locales/en';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';

registerLocaleData(en);

@NgModule({
  declarations: [HeroesComponent],
  imports: [
    CommonModule,
    SharedModule,
    HeroesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule,
    NzTableModule,
    NzDividerModule,
    NzDatePickerModule,
    NzSelectModule,
    NzLayoutModule,
    NzMenuModule,
    NzToolTipModule
  ],
  providers: [HeroesService, DatePipe]
})
export class HeroesModule { }
