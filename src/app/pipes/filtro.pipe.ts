import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: true
})
export class FiltroPipe implements PipeTransform {
  transform(items: any[], filtro: string, campo: string): any[] {
    if (!filtro || filtro.trim() === '') return items;
    return items.filter(item =>
      item[campo]?.toLowerCase().includes(filtro.toLowerCase())
    );
  }
}