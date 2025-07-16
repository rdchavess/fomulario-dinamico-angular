# Angular Form Dinâmico com ngx-bootstrap

Este projeto demonstra a criação de um **formulário dinâmico** em Angular 15 utilizando:
- Componentes standalone
- `ReactiveFormsModule`
- `ngx-bootstrap` com `bsDatepicker`
- Validações dinâmicas, inclusive entre datas

## Tecnologias
- Angular 15
- Bootstrap 5
- ngx-bootstrap
- Forms Reativos

## Como executar

1. Clone o repositório:
```bash
git clone https://github.com/rdchavess/fomulario-dinamico-angular.git
cd fomulario-dinamico-angular
```

2. Instale as dependências:
```bash
npm install
```

3. Rode o projeto:
```bash
npm run start:dev
```

Acesse em `http://localhost:4200`

## Estrutura
- `formulario-config.ts`: define o modelo de dados esperado
- `formulario-dinamico.component.ts`: cria o formulário dinamicamente
- `main.ts`: inicializa o app sem `AppModule`
- `styles.scss`: usa o tema Bootstrap

## Funcionalidades
- Campos diâmicos (`input`, `select`, `date`, `checkbox`, `radio`)
- Datepicker visual com Bootstrap
- Validações: obrigatoriedade, min/max de data, e consistência entre datas
