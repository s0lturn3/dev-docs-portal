import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, take } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { PageModel } from '../../../shared/models/db/page.model';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  
  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _HEADERS: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/json',
    'Accept': 'application/json'
  });

  private readonly _BASE_URL: string = `${ environment.baseUrl }/pages`;
  // #endregion PRIVATE

  // #region PUBLIC
  // [...]
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() { }


  // #region ==========> API <==========

  // #region GET
  
  public pages(): Observable<PageModel[]> {
    return this._http.get<PageModel[]>(this._BASE_URL, { 'headers': this._HEADERS, withCredentials: true })
      .pipe( take(1), catchError(err => { throw new Error('Ocorreu um erro ao buscar as páginas:', err) }) )
  }

  public getById(id: number): Observable<PageModel> {
    const url = `${ this._BASE_URL }/${id}`;

    return this._http.get<PageModel>(url, { 'headers': this._HEADERS, withCredentials: true })
      .pipe( take(1), catchError(err => { throw new Error('Ocorreu um erro ao buscar a página:', err) }) )
  }

  // #endregion GET

  // #region POST
  // [...]
  // #endregion POST

  // #region PUT
  // [...]
  // #endregion PUT

  // #region DELETE
  // [...]
  // #endregion DELETE

  // #endregion ==========> API <==========


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
