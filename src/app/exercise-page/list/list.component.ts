import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  @Input() title: string = '';
  @Input() items: { name: string; selected: boolean }[] = [];
  @Output() toggleItem = new EventEmitter<string>(); 

  onToggle(itemName: string) {
    this.toggleItem.emit(itemName);
  }

}
