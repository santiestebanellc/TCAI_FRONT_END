import { provideRouter, Routes } from '@angular/router';
import { AlertsPageComponent } from './alerts-page/alerts-page.component';
import { CareDataComponent } from './care-data/care-data.component';
import { MedicalDataComponent } from './medical-data/medical-data.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
// import { RoomsComponent } from './rooms/rooms.component';
import { DietsComponent } from './rooms/diets/diets.component';
import { GeneralComponent } from './rooms/general/general.component';

export const routes: Routes = [
  { path: 'rooms/general', component: GeneralComponent},
  { path: 'rooms/diets', component: DietsComponent},
  { path: 'alerts', component: AlertsPageComponent },
  { path: 'care-data', component: CareDataComponent },
  { path: 'medical-data', component: MedicalDataComponent },
  { path: 'personal-data', component: PersonalDataComponent },
  { path: '', redirectTo: 'rooms/general', pathMatch: 'full' },
];

export const appConfig = {
  providers: [provideRouter(routes)],
};
