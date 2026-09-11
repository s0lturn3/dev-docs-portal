import { Routes } from "@angular/router";
import { Page } from "./components/page/page";

export const PAGES_ROUTES: Routes = [
  { path: '', component: Page, title: 'Páginas' },
  { path: ':id', component: Page, title: 'Página' },
];