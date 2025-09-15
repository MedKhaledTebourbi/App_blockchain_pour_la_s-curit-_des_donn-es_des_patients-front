import { Pharmacie } from "./Pharmacie";

export interface Medicament {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  pharmacie?: Pharmacie; // relation inverse (optionnelle pour éviter récursion infinie)
}