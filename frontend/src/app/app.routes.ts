import { Routes } from '@angular/router';

import { authChildrenGuard } from './core/guards/auth-children-guard';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/login/login';
import { Home } from './features/home/home';
import { Header } from './shared/components/header/header';

export const routes: Routes = [

  {
    path: '',
    component: Header,
    children: [
      { path: 'inicio', component: Home, title: 'Início' },

      {
        path: 'pages',
        loadChildren: () => import('./features/pages/pages.routes').then(r => r.PAGES_ROUTES)
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
      }
    ],
    canActivateChild: [ authChildrenGuard ]
  },
  {
    path: 'login',
    component: Login,
    canActivate: [ authGuard ],
  },

];
