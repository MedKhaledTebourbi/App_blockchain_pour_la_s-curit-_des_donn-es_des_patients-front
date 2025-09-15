import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmartContratComponent } from './Component/smart-contrat/smart-contrat.component';
import { DocteurComponent } from './Component/docteur/docteur.component';
import { PatientComponent } from './Component/patient/patient.component';
import { UtilisateurComponent } from './Component/utilisateur/utilisateur.component';
import { FrontComponent } from './Component/front/front.component';
import { UpdateordComponent } from './Component/updateord/updateord.component';
import { AuthGuard } from './Component/auth/auth.guard';
import { PharmacieComponent } from './Component/pharmacie/pharmacie.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Page par défaut = login
  { path: 'login', component: UtilisateurComponent },
  
  { path: 'smartcontract', component: SmartContratComponent, canActivate: [AuthGuard] },
  { path: 'smartcontract/:id', component: SmartContratComponent, canActivate: [AuthGuard] },
  { path: 'docteur', component: DocteurComponent, canActivate: [AuthGuard] },
  { path: 'patient', component: PatientComponent, canActivate: [AuthGuard] },
  { path: 'updateord', component: UpdateordComponent, canActivate: [AuthGuard] },
  { path: 'front', component: FrontComponent, canActivate: [AuthGuard] },
  { path: 'pharmacy', component:PharmacieComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'login' } // Si URL inconnue → login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
