import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FormularioDinamicoComponent } from './components/formulario-dinamico/formulario-dinamico.component';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

defineLocale('pt-br', ptBrLocale); // ✅ TEM QUE vir antes do use()

@Component({
  selector: 'app-root',
  // templateUrl: './app.component.html',
  template: `
    <app-formulario-dinamico (formSubmit)="handleSubmit($event)"></app-formulario-dinamico>
    <pre *ngIf="!!form">{{ form | json }}</pre>
  `,
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, BsDatepickerModule, FormularioDinamicoComponent],
})
export class AppComponent {
  title = 'form-dinamico-frontend-angular';
  private localeService = inject(BsLocaleService);
  form: any | undefined;

  constructor() {
    this.localeService.use('pt-br');
    console.debug('Bootstrap initialized with locale pt-BR');
  }

  handleSubmit(dados: any) {
    console.log('Dados do formulário: ', dados);
    this.form = dados;
  }
}
