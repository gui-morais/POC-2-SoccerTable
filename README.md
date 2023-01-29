# Bem-vindos ao SoccerTable
Esse repositório tem como objetivo criar uma API que armazena informações estátisticas de um campeonanto de futebol. Para isso, foram utilizados alguns conceitos de **Express**, **Node**, **PostgresSQL** e o básico de **Typescript**. 

# Documentação
Esse projeto visa a armazenar e manipular algumas estatísticas básicas de um campeonato de futebol, como jogos disputados, vencidos, empatadados e perdidos e gols marcados e sofridos, além de armazenar distinguir jogos a serem realizados de jogos já finalizados. A lógica esportiva da aplicação segue as regras de um campeonato de pontos corridos com turno e returno.
## Estrutura do banco de dados:
Essa aplicação está conectada diretamente a um banco de dados SQL que possui 2 entidades: **teams** e **matches**.

Na entidade teams, temos as informações de cada equipe, que está limitada a seu nome, que deve ser único para cada entrada.

Já na entidade matches, temos as informações das partidas do campeonato, que informa as equipes que estão a jogar (diferenciando como time da casa e time visitante), o placar da partida e se essa partida foi ou não realizada.

Inicialmente, o banco de dados foi preenchido com os times e jogos da edição 2022/23 da Premier League apenas como forma de iniciar o banco de dados, podendo esses dados serem apagados e modificados.
## Rotas
### Post: /team

    body: {
    name: string
    }

Essa rota tem como objetivo cadastrar novas equipes no campeonato.

**Possíveis erros:**

**422:** A entidade body não seguiu o padrão requerido.

**409:** Já existe uma equipe com o mesmo nome.

**500:** Erro no banco de dados.

### Delete: /team

    body: {
    name: string
    }

Essa rota tem como objetivo deletar equipes já cadastradas no campeonato. Essa rota também deleta todos os jogos nos quais essa equipe participa ou participou.

**Possíveis erros:**

**422:** A entidade body não seguiu o padrão requerido.

**404:** Não existe uma equipe cadastrada com esse nome.

**500:** Erro no banco de dados.
### Post: /match

    body: {
    home: string,
    away: string
    }

Essa rota tem como objetivo registrar novas partidas do campeonato. Por padrão, essa rota cria jogos que ainda não ocorreram.

**Possíveis erros:**

**422:** A entidade body não seguiu o padrão requerido ou os clubes home e away são os mesmos.

**404:** Um dos clubes não está registrado no campeonato.

**409:** O jogo já está cadastrado no campeonato.

**500:** Erro no banco de dados.

### Delete: /match

    body: {
    home: string,
    away: string
    }

Essa rota tem como objetivo deletar as partidas do campeonato. Essa rota é capaz de deletar tanto partidas agendadas quanto já realizadas.

**Possíveis erros:**

**422:** A entidade body não seguiu o padrão requerido.

**404:** Um dos clubes não está registrado no campeonato.

**409:** Essa partida não está registrada no campeonato.

**500:** Erro no banco de dados.

### Put: /match

    body: {
    home: string,
    away: string,
    home_goals: integer,
    away_goals: integer
    }

Essa rota tem como objetivo registrar ou alterar os placares das partidas do campeonato. Por padrão, essa rota modifica o status da partida para realizada.

**Possíveis erros:**

**422:** A entidade body não seguiu o padrão requerido.

**404:** A partida não está cadastrada no banco de dados ainda. Utilize a rota POST

**500:** Erro no banco de dados.
### Get: /table

    body: {}

Essa rota retorna a tabela completa do campeonato, mostrando partidas jogadas, vitorias, empates, derrotas, gols marcados e gols sofridos.

**Possíveis erros:**

**500:** Erro no banco de dados.

### Get: /table/:name

    body: {}

Essa rota retorna a tabela de uma equipe específica do campeonato, mostrando partidas jogadas, vitorias, empates, derrotas, gols marcados e gols sofridos.

**Possíveis erros:**

**500:** Erro no banco de dados.

### Get: /matches/:name

    body: {}

Essa rota retorna todas as partidas de uma equipe.

**Possíveis erros:**

**404:** O clube não está cadastrado no campeonato.

**500:** Erro no banco de dados.