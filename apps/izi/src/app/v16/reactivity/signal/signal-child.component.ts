import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon, PokemonDetails } from './models/response.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PokemonService } from './signal.service';

@Component({
  selector: 'izi-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="pokemonDetails() as pokemon">
      <div class="shadow-xl rounded-lg p-4 bg-neutral-800">
        <img
          [src]="pokemon.sprites.front_default"
          [alt]="pokemon.name"
          class="w-48 h-48 mx-auto"
        />
        <h2 class="text-xl text-neutral-200 text-center">
          {{ pokemon.name | uppercase }}
        </h2>
      </div>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {
  readonly #pokemonService = inject(PokemonService);
  readonly #destroyRef = inject(DestroyRef);

  readonly pokemonDetails = signal<PokemonDetails | null>(null);
  @Input({ required: true }) set pokemon(value: Pokemon) {
    this.#pokemonService
      .loadPokemon(value.url)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((pokemonDetails) => this.pokemonDetails.set(pokemonDetails));
  }
}
