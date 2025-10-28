#language: pt
Funcionalidade: Conversar com NeonBot
  Como um usuário
  Eu quero enviar uma mensagem para o NeonBot e receber uma resposta

  Cenário: Enviar uma saudação simples
    Dado que eu abro a página de chat
    Quando eu digito "Olá" e envio a mensagem
    Então eu devo ver uma resposta do bot contendo "NeonBot"

  Cenário: Enviar uma mensagem longa
    Dado que eu abro a página de chat
    Quando eu digito uma mensagem longa e envio
    Então eu devo ver uma resposta do bot contendo "NeonBot"

  Cenário: Enviar múltiplas mensagens
    Dado que eu abro a página de chat
    Quando eu envio "Primeira mensagem" e depois "Segunda mensagem"
    Então eu devo ver duas respostas do bot cada uma contendo "NeonBot"

  Cenário: Manipular mensagem vazia
    Dado que eu abro a página de chat
    Quando eu tento enviar uma mensagem vazia
    Então nenhuma nova mensagem deve aparecer

  Cenário: Testar responsividade da UI
    Dado que eu abro a página de chat
    Quando eu redimensiono a janela para tamanho mobile
    Então a UI de chat deve permanecer funcional

  Cenário: Gerenciar um atendimento pelo chat
    Dado que eu abro a página de chat
  Quando eu solicito a abertura de um atendimento para "Fulana" com contato "12345"
    Então o bot confirma a criação do atendimento
    Quando eu consulto o status do último atendimento
    Então o bot responde que o atendimento está "open"
    Quando eu fecho o último atendimento
    Então o bot confirma que o atendimento foi encerrado
