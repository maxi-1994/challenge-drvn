import { Component, computed, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-message',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() public message: string = '';
  @Input() public type: 'error' | 'success' | 'info' = 'error';

  public icon = computed(() => {
      switch (this.type) {
        case 'success': return 'check_circle';
        case 'info': return 'info';
        case 'error': default: return 'error_outline';
      }
  });
  
  public cssClass = computed(() => `${this.type}-card`);
}
