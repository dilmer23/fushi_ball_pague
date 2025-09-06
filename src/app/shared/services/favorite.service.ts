import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private favCount$ = new BehaviorSubject<number>(0);
  public favCountObs$ = this.favCount$.asObservable();

  getCount(): number {
    return this.favCount$.value;
  }

  setCount(value: any): void {
    this.favCount$.next(value);
  }

  increment(): void {
    this.favCount$.next(this.favCount$.value + 1);
  }

  decrement(): void {
    this.favCount$.next(Math.max(0, this.favCount$.value - 1));
  }

  reset(): void {
    this.favCount$.next(0);
  }
}