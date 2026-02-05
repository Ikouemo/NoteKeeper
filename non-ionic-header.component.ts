import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-non-ionic-header',
  templateUrl: './non-ionic-header.component.html',
  styleUrls: ['./non-ionic-header.component.css'],
})
export class NonIonicHeaderComponent {
  @Input() title = '';
  @Input() showClose = false;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
