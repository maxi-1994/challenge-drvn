import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-filter',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss'
})
export class SearchFilterComponent implements OnDestroy {
  @Output() searchChangeEvent = new EventEmitter<any>();

  private searchInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.searchInput$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value: string) => {
        this.searchChangeEvent.emit(value);
      });
  }

  onInputChange(event: any): void {
    const value = event.target.value;
    this.searchInput$.next(value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}