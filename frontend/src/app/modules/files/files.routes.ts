import { Routes, UrlSegment } from '@angular/router';

export const POKEMON_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/main-page/main-page.component').then(
        (r) => r.MainPageComponent
      ),
  },
  // {
  //   path: ':id',
  //   loadComponent: () =>
  //     import('./pages/pokemon-page/pokemon-page.component').then(
  //       (r) => r.PokemonPageComponent
  //     ),
  //   canMatch: [
  //     // only allow to match when path is a number
  //     (_: never, segments: UrlSegment[]) =>
  //       segments[0].path === String(Number(segments[0].path)),
  //   ],
  // },
];
