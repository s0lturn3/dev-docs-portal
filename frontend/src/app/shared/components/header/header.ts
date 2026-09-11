import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import packageJson from '../../../../../package.json';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'docs-header',
  templateUrl: './header.html',
  imports: [
    TooltipModule,
    NgClass,
    RouterOutlet
  ],
  styles: `
    #header {
      height: 64px;
    }
  `,
})
export class Header {
  
  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  public readonly _theme: ThemeService = inject(ThemeService);
  public readonly currentTheme = this._theme.theme;
  public readonly isDark = this._theme.isDark;

  public get version(): string { return packageJson.version }
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() { }

  ngOnInit() { }


  // #region ==========> UTILS <==========
  
  public toggleTheme(): void { this._theme.toggle() }

  // #endregion ==========> UTILS <==========

}
