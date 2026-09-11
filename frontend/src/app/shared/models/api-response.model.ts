export class ApiResponse<T> {
  code: number = 200;     // Código de status da resposta
  error: boolean = false; // Indica se houve erro
  errorMessage?: string;  // Mensagem de erro (opcional, só em caso de erro)
  body?: T;               // Dados retornados pela API
  metadata?: any;         // Metadados adicionais (opcional)
}