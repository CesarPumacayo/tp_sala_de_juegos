import { Component, inject, OnInit } from '@angular/core';
import { GithubService } from '../../services/github-service';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {

  private githubService = inject(GithubService);

  usuario: any;
  title: string = 'Quién Soy';
  subtitle: string =  'Juego propio y cómo jugarlo: ';
  
  ngOnInit(): void {

    this.githubService.getUsuarioGithub().subscribe(data => {
      this.usuario = data;
    });

  }

}