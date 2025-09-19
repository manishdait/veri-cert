import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _dark = signal(false);

  constructor(private storage: LocalStorageService) {
    this.loadTheme();
  }

  toggle() {
    const isDark = document.documentElement.classList.toggle('dark');
    this.storage.store('theme', isDark? 'dark' : 'light');
    this._dark.set(isDark);
  }
  
  get dark() {
    return this._dark;
  }

  private loadTheme() {
    const theme = this.storage.retrieve('theme');
    
    if (theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        this._dark.set(true);
      }
      else {
        document.documentElement.classList.remove('dark');
        this._dark.set(false);
      }
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        this._dark.set(true);
      } else {
        this._dark.set(false);
      }
    }
  }
}
