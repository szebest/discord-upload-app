import { Routes } from '@angular/router';

import { DefaultLayoutComponent } from '@layout/containers';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    loadChildren: () =>
      import('./modules/files/files.routes').then((r) => r.POKEMON_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
