import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { PageModel } from '../../shared/models/db/page.model';
import { PagesService } from '../pages/services/pages.service';

@Component({
  selector: 'docs-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private readonly _pages: PagesService = inject(PagesService);
  // #endregion PRIVATE

  // #region PUBLIC
  public pages?: PageModel[];
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() { }

  ngOnInit(): void {
    this.getPages();
  }


  // #region ==========> API <==========

  // #region GET
  
  public getPages(): void {
    this._pages.pages().subscribe({
      next: res => {
        console.log(res);
        this.pages = res;
      },
      error: err => {
        console.error(err);
        this.pages = [];
      }
    });
  }

  // #endregion GET

  // #endregion ==========> API <==========


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
