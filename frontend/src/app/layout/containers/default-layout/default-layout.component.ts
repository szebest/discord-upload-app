import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MatToolbarModule, NgOptimizedImage],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
})
export class DefaultLayoutComponent {}
