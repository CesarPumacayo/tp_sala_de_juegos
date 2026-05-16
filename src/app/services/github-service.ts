import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GithubService {

  private http = inject(HttpClient);

  private apiUrl = 'https://api.github.com/users/CesarPumacayo';
  

  getUsuarioGithub() {
    return this.http.get(this.apiUrl);
  }
}

