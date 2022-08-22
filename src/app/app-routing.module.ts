import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotAuthenticationGuard} from '../app/core/authentication/authentication.guard';
import { HeroesModule} from './heroes/heroes.module';
const routes: Routes = [
  { path: '', redirectTo: '/heroes', pathMatch: 'full' },
  {path: 'heroes', loadChildren: () => HeroesModule, canActivate: [NotAuthenticationGuard]},
  { path: '**', redirectTo: '/heroes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
