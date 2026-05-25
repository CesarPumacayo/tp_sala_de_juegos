import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TriviaResponse } from '../models/preguntados.models';


@Injectable({
  providedIn: 'root',
})
export class PreguntadoService {
    private http = inject(HttpClient);
    private apiUrl = 'https://opentdb.com/api.php?amount=10';

    getPreguntados() {
        return this.http.get<TriviaResponse>(this.apiUrl);
    }
}