import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search {
    searchTerm: string = '';
    @Output() searchChanged = new EventEmitter<string>();

    onSearchChange(term: string) {
        this.searchTerm = term;
        this.searchChanged.emit(this.searchTerm);
        console.log('Search term:', this.searchTerm);
    }
}
