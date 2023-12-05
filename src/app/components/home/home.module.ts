import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [HomeComponent],
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
