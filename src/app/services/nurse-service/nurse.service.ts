import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NurseService {
  private loginNurse = '/login';

  constructor(private http: HttpClient) {}
}
