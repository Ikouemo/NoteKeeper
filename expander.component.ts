import { Component, Input } from '@angular/core';

export type ExpanderInfoLevel =
  | 'info'
  | 'success'
  | 'error'
  | 'warning'
  | 'default'
  | 'disabled'
  | 'inactive';

@Component({
  selector: 'app-expander',
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.scss'],
})
export class ExpanderComponent {
  /**
   * Titel des Expanders.
   */
  @Input() title = 'Titel';

  /**
   * Optionaler Beschreibungstext unter dem Titel.
   */
  @Input() description: string | null = null;

  /**
   * Aktueller Status des Expanders.
   */
  @Input() set infoLevel(value: ExpanderInfoLevel) {
    this._infoLevel = value;
    if (value === 'disabled') {
      this.isExpanded = false;
    }
  }

  public get infoLevel(): ExpanderInfoLevel {
    return this._infoLevel;
  }

  private _infoLevel: ExpanderInfoLevel = 'info';

  /**
   * Steuert, ob der Inhalt sichtbar ist.
   */
  @Input() isExpanded = false;

  public toggleExpand(): void {
    if (this.infoLevel !== 'disabled') {
      this.isExpanded = !this.isExpanded;
    }
  }
}
