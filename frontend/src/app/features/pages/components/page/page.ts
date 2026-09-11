import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownComponent, MarkdownService } from "ngx-markdown";
import { PageModel } from '../../../../shared/models/db/page.model';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'docs-page',
  imports: [MarkdownComponent],
  templateUrl: './page.html',
  styleUrl: './page.scss',
})
export class Page {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private readonly _pages: PagesService = inject(PagesService);
  private readonly _router: Router = inject(Router);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _markdownService: MarkdownService = inject(MarkdownService);

  private pageId?: number;
  // #endregion PRIVATE

  // #region PUBLIC
  public page?: PageModel;
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() { }

  ngOnInit(): void {
    this.initialize();
  }


  // #region ==========> API <==========

  // #region GET
  
  public getPage(): void {
    this._pages.getById(this.pageId!).subscribe({
      next: res => {
        console.log(res);
        this.page = res;
        this._markdownService.reload();
      },
      error: err => {
        console.error(err);
      }
    });
  }

  // #endregion GET

  // #endregion ==========> API <==========


  // #region ==========> UTILS <==========
  
  private initialize() {
    const routeParam = this._route.snapshot.paramMap.get('id');
    
    if (routeParam) {
      this.pageId = parseInt(routeParam);
      this.getPage();
    }
    else {
      
    }
  }

  // #endregion ==========> UTILS <==========

}
