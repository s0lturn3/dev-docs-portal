import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';

export const storageKey = 'docs-theme';
export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  // #region ==========> PROPERTIES <==========

  // #region PUBLIC
  public readonly theme: WritableSignal<ThemeMode> = signal<ThemeMode>('light');
  public readonly isDark = computed(() => this.theme() === 'dark');
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  constructor() {
    this.load();

    effect(() => {
      const currentTheme = this.theme();
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');
      localStorage.setItem(storageKey, currentTheme);

      console.log(currentTheme);
    });
  }


  // #region ==========> UTILS <==========
  
  public getToggleLabel(): string {
    return `Switch to ${this.isDark() ? 'light' : 'dark'} mode`;
  }

  public toggle(): void {
    this.theme.update((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  public set(theme: ThemeMode): void {
    this.theme.set(theme);
  }

  private load(): void {
    const savedTheme = localStorage.getItem(storageKey) as ThemeMode | null;

    if (savedTheme === 'light' || savedTheme === 'dark') {
      this.theme.set(savedTheme);
      return;
    }

    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(userPrefersDark ? 'dark' : 'light');
  }

  // #endregion ==========> UTILS <==========

}
