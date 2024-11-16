import { Component } from '@angular/core';
import { MenuBarComponent } from "../menu-bar/menu-bar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuBarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  visible: boolean = false;
}