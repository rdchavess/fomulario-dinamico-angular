export interface FormularioConfig {
  idFormulario: number;
  nome: string;
  descricao: string;
  campos: CampoFormulario[];
}

export interface CampoFormulario {
  idCampo: number;
  nome: string;
  label: string;
  tipoDado: 'string' | 'number' | 'boolean' | 'date';
  tipoCampo: 'checkbox' | 'radio' | 'select' | 'input' | 'date';
  obrigatorio: boolean;
  ordem: number;
  valorDefault?: any;
  placeholder?: string;
  opcoes?: CampoOpcao[];
  urlOpcoes?: string;
  validacoes?: CampoValidacao[];
}

export interface CampoOpcao {
  valor: string;
  rotulo: string;
}

export interface CampoValidacao {
  tipoValidacao: string;
  valor: any;
  mensagemErro: string;
}
