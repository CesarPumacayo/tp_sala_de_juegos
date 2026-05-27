import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Pregunta, TriviaResponse } from '../models/preguntados.models';

@Injectable({
  providedIn: 'root',
})
export class PreguntadoService {
    private http = inject(HttpClient);
    private apiUrl = 'https://opentdb.com/api.php?amount=10';

    getPreguntados() {
        return this.http.get<TriviaResponse>(this.apiUrl).pipe(
            map(data => data.results.map(p => ({
                ...p,
                opciones: this.mezclar([p.correct_answer, ...p.incorrect_answers])
            }) as Pregunta))
        );
    }

    private mezclar(arr: string[]): string[] {
        return arr.sort(() => Math.random() - 0.5);
    }
}