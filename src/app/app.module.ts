import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { SmartContratComponent } from './Component/smart-contrat/smart-contrat.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DocteurComponent } from './Component/docteur/docteur.component';
import { PatientComponent } from './Component/patient/patient.component';
import { UtilisateurComponent } from './Component/utilisateur/utilisateur.component';
import { FrontComponent } from './Component/front/front.component';
import { UpdateordComponent } from './Component/updateord/updateord.component';
import { PharmacieComponent } from './Component/pharmacie/pharmacie.component';


@NgModule({
  declarations: [
    AppComponent,
    SmartContratComponent,
    DocteurComponent,
    PatientComponent,
    UtilisateurComponent,
    FrontComponent,
    UpdateordComponent,
    PharmacieComponent

   
  ],
  imports: [
    BrowserModule,
    FormsModule,           // si tu utilises [(ngModel)]
    HttpClientModule,      // ✅ obligatoire pour HttpClient
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
