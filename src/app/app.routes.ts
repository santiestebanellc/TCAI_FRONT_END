import { provideRouter, Routes } from '@angular/router';
import { AddMedicalDataComponent } from './add-medical-data/add-medical-data.component';
import { AlertsPageComponent } from './alerts-page/alerts-page.component';
import { CareDataComponent } from './care-data/care-data.component';
import { CaredataformComponent } from './care-data-summary/caredataform/caredataform.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { MedicalDataComponent } from './medical-data/medical-data.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { DietsComponent } from './rooms/diets/diets.component';
import { GeneralComponent } from './rooms/general/general.component';
// import { RoomsComponent } from './rooms/rooms.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'rooms/general', component: GeneralComponent },
      { path: 'rooms/diets', component: DietsComponent },
      {
        path: 'care-data',
        component: CareDataComponent,
        children: [{ path: 'add-care-data', component: CaredataformComponent }],
      },
      { path: 'alerts', component: AlertsPageComponent },
      { path: 'medical-data', component: MedicalDataComponent },
      { path: 'personal-data', component: PersonalDataComponent },
      { path: 'add-medical-data', component: AddMedicalDataComponent },
    ],
  },
  { path: '', redirectTo: 'rooms/general', pathMatch: 'full' },
  { path: '**', redirectTo: 'rooms/general' },
];

export const appConfig = {
  providers: [provideRouter(routes)],
};
