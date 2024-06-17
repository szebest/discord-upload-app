import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokemonId',
  standalone: true,
})
export class PokemonIdPipe implements PipeTransform {
  transform(value: string | number): unknown {
    return `#${value.toString().padStart(4, '0')}`;
  }
}
