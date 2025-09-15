import { Medicament } from "./Medicament";

export interface Pharmacie {
  id?: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  responsable: string;
  medicaments?: Medicament[]; // Liste des médicaments
}