import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CampoOpcao, FormularioConfig } from './fomulario-config';
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import * as FomularioDinamicoValidators from './validations';
import { take } from 'rxjs';


@Component({
  selector: 'app-formulario-dinamico',
  templateUrl: './formulario-dinamico.component.html',
  styleUrls: ['./formulario-dinamico.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    HttpClientModule
  ],
})
export class FormularioDinamicoComponent implements OnInit {
  private _config!: FormularioConfig;
  @Output() formSubmit = new EventEmitter<any>();
  form: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    // Simula uma chamada da API
    this.config = this.mockFormulario();

    this.form = this.fb.group({});
    this.config.campos.forEach(campo => {
      const validators = [];

      if (campo.obrigatorio) {
        if (campo.tipoCampo === 'checkbox') {
          validators.push(Validators.requiredTrue);
        } else{
          validators.push(Validators.required);
        }
      }

      if (campo.urlOpcoes) {
        this.http.get<CampoOpcao[]>(campo.urlOpcoes)
          .pipe(take(1))
          .subscribe(opcoes => {
            campo.opcoes = opcoes;
          });
      }

      campo.validacoes?.forEach(v => {
        switch (v.tipoValidacao) {
          case 'minlength':
            validators.push(Validators.minLength(+v.valor));
            break;
          case 'maxlength':
            validators.push(Validators.maxLength(+v.valor));
            break;
          case 'pattern':
            validators.push(Validators.pattern(v.valor));
            break;
          case 'minDate':
            validators.push(FomularioDinamicoValidators.minDateValidator(v.valor));
            break;
          case 'maxDate':
            validators.push(FomularioDinamicoValidators.maxDateValidator(v.valor));
            break;
        }
      });

      this.form.addControl(campo.nome, this.fb.control(campo.valorDefault || '', validators));
    });

    // Validação entre datas
    const dataRanteValidators: ValidatorFn[] = [];

    this.config.campos.forEach(campo => {
      campo.validacoes?.forEach(v => {
        if (v.tipoValidacao === 'dataRange') {
          const campoInicio = campo.nome;
          const campoFim = v.valor;
          dataRanteValidators.push(FomularioDinamicoValidators.dataRangeValidator(campoInicio, campoFim));
        }
      });
    });

    if (dataRanteValidators.length > 0) {
      this.form.setValidators(FomularioDinamicoValidators.validatorsCompose(dataRanteValidators));
    }

  }

  public get config(): FormularioConfig {
    return this._config;
  }
  @Input() public set config(value: FormularioConfig) {
    if (!!value?.campos) {
      value.campos = value.campos.sort((a, b) => a.ordem - b.ordem);
    }
    this._config = value;
  }

  enviar() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
      console.log('Form enviado com sucesso!', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }


  // Add this method to your component class
  getValidacaoMensagemErro(campo: any, tipo: string): string | undefined {
    return campo.validacoes?.find((v: any) => v.tipoValidacao)?.mensagemErro;
  }

  private mockFormulario(): FormularioConfig {
    return {
      idFormulario: 1,
      nome: 'cadastro_pessoa',
      descricao: 'Cadastro de pessoa',
      campos: [
        {
          idCampo: 1,
          nome: 'nome',
          label: 'Nome',
          tipoDado: 'string',
          tipoCampo: 'input',
          obrigatorio: true,
          ordem: 1,
          placeholder: 'Digite seu nome',
          validacoes: [
            { tipoValidacao: 'minlength', valor: 3, mensagemErro: 'Nome deve ter no mínimo 3 letras' },
            { tipoValidacao: 'maxlength', valor: 50, mensagemErro: 'Nome pode ter no máximo 50 letras' }
          ]
        },
        {
          idCampo: 2,
          nome: 'sexo',
          label: 'Sexo',
          tipoDado: 'string',
          tipoCampo: 'select',
          obrigatorio: true,
          ordem: 2,
          placeholder: 'Selecione o sexo',
          opcoes: [
            { valor: 'M', rotulo: 'Masculino' },
            { valor: 'F', rotulo: 'Feminino' },
            { valor: 'O', rotulo: 'Outro' }
          ]
        },
        {
          idCampo: 3,
          nome: 'dataNascimento',
          label: 'Data de Nascimento',
          tipoDado: 'date',
          tipoCampo: 'date',
          obrigatorio: true,
          ordem: 3,
          placeholder: 'Informe a data de nascimento',
          validacoes: [
            {
              tipoValidacao: 'minDate',
              valor: '1900-01-01',
              mensagemErro: 'Data não pode ser anterior a 01/01/1900'
            },
            {
              tipoValidacao: 'maxDate',
              valor: '2025-12-31',
              mensagemErro: 'Data não pode ser posterior a 31/12/2025'
            }
          ]
        },
        {
          idCampo: 4,
          nome: 'dataInicio',
          label: 'Data de Início',
          tipoDado: 'date',
          tipoCampo: 'date',
          obrigatorio: true,
          ordem: 5,
          validacoes: [
            {
              tipoValidacao: 'minDate',
              valor: '2020-01-01',
              mensagemErro: 'Data de início deve ser a partir de 01/01/2020'
            },
            {
              tipoValidacao: 'dataRange',
              valor: 'dataFim',
              mensagemErro: 'Data de início deve ser anterior à data de fim'
            }
          ]
        },
        {
          idCampo: 5,
          nome: 'dataFim',
          label: 'Data de Fim',
          tipoDado: 'date',
          tipoCampo: 'date',
          obrigatorio: true,
          ordem: 6,
          validacoes: [
            {
              tipoValidacao: 'maxDate',
              valor: '2030-12-31',
              mensagemErro: 'Data de fim deve ser até 31/12/2030'
            }
          ]
        },
        {
          idCampo: 6,
          nome: 'dataInicio2',
          label: 'Data de Início 2',
          tipoDado: 'date',
          tipoCampo: 'date',
          obrigatorio: true,
          ordem: 7,
          validacoes: [
            {
              tipoValidacao: 'minDate',
              valor: '2020-01-01',
              mensagemErro: 'Data de início 2 deve ser a partir de 01/01/2020'
            },
            {
              tipoValidacao: 'dataRange',
              valor: 'dataFim2',
              mensagemErro: 'Data de início 2 deve ser anterior à data de fim 2'
            }
          ]
        },
        {
          idCampo: 7,
          nome: 'dataFim2',
          label: 'Data de Fim 2',
          tipoDado: 'date',
          tipoCampo: 'date',
          obrigatorio: true,
          ordem: 8,
          validacoes: [
            {
              tipoValidacao: 'maxDate',
              valor: '2030-12-31',
              mensagemErro: 'Data de fim deve ser até 31/12/2030'
            }
          ]
        },
        {
          idCampo: 8,
          nome: 'pais',
          label: 'País',
          tipoDado: 'string',
          tipoCampo: 'select',
          obrigatorio: true,
          ordem: 4,
          placeholder: 'Informe o país de nascimento',
          urlOpcoes: 'http://localhost:3000/paises?_sort=rotulo&_order=asc',
          validacoes: []
        },
        {
          idCampo: 9,
          nome: 'genero',
          label: 'Gênero',
          tipoDado: 'string',
          tipoCampo: 'radio',
          obrigatorio: true,
          ordem: 9,
          opcoes: [
            { valor: 'M', rotulo: 'Masculino' },
            { valor: 'F', rotulo: 'Feminino' }
          ]
        },
        {
          idCampo: 10,
          nome: 'aceitaTermos',
          label: 'Aceito os termos',
          tipoDado: 'boolean',
          tipoCampo: 'checkbox',
          obrigatorio: true,
          ordem: 10,
          valorDefault: false,
        }
      ]
    };
  }
}
