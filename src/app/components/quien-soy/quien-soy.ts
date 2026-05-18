import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { GithubService } from '../../services/github-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {

  private githubService = inject(GithubService);
  private cdr = inject(ChangeDetectorRef)

  usuario: any;
  title: string = 'Quién Soy';
  subtitle: string =  'Juego propio y cómo jugarlo: ';
  
  ngOnInit(): void {

    this.githubService.getUsuarioGithub().subscribe(data => {
      this.usuario = data;
      this.cdr.detectChanges();
    });

  }

}