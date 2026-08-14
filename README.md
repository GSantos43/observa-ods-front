# ObservaODS Frontend — arquitetura e regras de interface

Este documento descreve a arquitetura do cliente web do ObservaODS e o comportamento de cada tela. Ele é a referência para pessoas desenvolvedoras e agentes de IA que precisem alterar o frontend sem confundir conteúdo demonstrativo, estado visual e regras realmente persistidas pela API.

Para o domínio, endpoints e invariantes de persistência, consulte o [`README.md` do backend](../backend/README.md). Para o fluxo operacional do comitê, consulte o [`README.md` da raiz](../README.md).

## Resumo executivo para IAs

Preserve estas decisões ao trabalhar no frontend:

1. A aplicação é uma SPA Vue 3 construída com Quasar, TypeScript estrito e Composition API.
2. A URL da API vem de `VITE_API_URL`; o padrão é `http://localhost:3000/api/v1`.
3. Rotas públicas podem usar `apiRequest`. Rotas administrativas devem usar `auth.request` para enviar JWT e tratar `401`.
4. O token fica em `localStorage` sob `observaods_access_token`; a sessão é restaurada por `GET /auth/me`.
5. As rotas com `meta.requiresAuth` são protegidas no router. Isso melhora a navegação, mas a segurança real continua no backend.
6. O frontend possui fallbacks demonstrativos. Nunca trate automaticamente todos os dados exibidos como registros reais do banco.
7. `Observation` representa valor observado com fonte, período e território. É ela que alimenta os gráficos públicos.
8. `ActionIndicator.newValue` é um valor associado à ação. Ele não deve ser inserido na série histórica sem uma observação formal.
9. A relevância da ação é persistida como número de 1 a 5, mas apresentada como Complementar, Apoio, Relevante, Estruturante ou Prioritária.
10. A variação do indicador é calculada comparando observações e respeitando a polaridade. Relação com uma ação não prova causalidade.
11. O painel administrativo centraliza muitos fluxos em `AdminPage.vue`; alterações locais podem afetar várias seções.
12. Preserve responsividade, navegação por teclado, estados de loading e ausência de layout shift nas áreas já tratadas.

## Tecnologias

- Vue 3 com `<script setup lang="ts">`;
- Quasar 2 para layout, componentes, dialogs, notificações e ícones Material;
- Vue Router em modo history;
- Pinia para autenticação;
- Vite via Quasar CLI;
- Tailwind CSS 4 para utilitários;
- CSS global próprio em `src/css/app.css`;
- `@fontsource/inter` para a tipografia.

O TypeScript usa:

- `strict: true`;
- `noUncheckedIndexedAccess: true`;
- `exactOptionalPropertyTypes: true`.

Evite contornar erros com `any`. Prefira contratos explícitos próximos do consumidor ou tipos compartilhados em `src/data` quando forem usados por várias telas.

## Estrutura de diretórios

```text
frontend/
├── src/
│   ├── assets/                 # logo, fotos dos ODS e fundos institucionais
│   ├── components/             # componentes genéricos remanescentes
│   ├── css/app.css             # design system e estilos globais
│   ├── data/ods.ts             # tipos ODS e fallback demonstrativo
│   ├── layouts/MainLayout.vue  # cabeçalho e navegação principal
│   ├── pages/                  # páginas roteadas
│   ├── router/                 # rotas e guards de navegação
│   ├── services/api.ts         # cliente HTTP
│   ├── services/route-loading.ts
│   ├── stores/auth-store.ts    # sessão JWT
│   └── App.vue                 # raiz e overlay global de loading
├── .env.example
├── quasar.config.ts
├── eslint.config.js
├── tsconfig.json
└── package.json
```

## Inicialização local

```bash
cp .env.example .env
npm install
npm run dev
```

Endereços padrão:

- frontend: `http://localhost:9000`;
- backend: `http://localhost:3000/api/v1`.

Variável necessária:

```dotenv
VITE_API_URL="http://localhost:3000/api/v1"
```

### Scripts

| Comando | Finalidade |
|---|---|
| `npm run dev` | Executa o Quasar em desenvolvimento na porta 9000. |
| `npm run typecheck` | Valida os tipos Vue/TypeScript sem gerar arquivos. |
| `npm run build` | Gera a SPA de produção em `dist/spa`. |
| `npm run lint` | Executa ESLint sobre `src`; depende da configuração Vue/TypeScript estar compatível. |

Para validar uma alteração de interface, execute pelo menos:

```bash
npm run typecheck
npm run build
git diff --check
```

Também teste manualmente larguras de celular, tablet e desktop, principalmente quando houver tabelas, dialogs, grids ou textos variáveis.

## Fluxo geral da aplicação

```text
App.vue
  -> overlay global de troca de rota
  -> router
     -> guard restaura sessão
     -> redireciona conforme requiresAuth/guestOnly
     -> MainLayout nas páginas normais
        -> header + menu + conteúdo roteado
     -> ReproducaoPage em layout independente
```

## Router

As rotas estão em `src/router/routes.ts`.

| Caminho | Nome | Acesso | Componente | Responsabilidade |
|---|---|---|---|---|
| `/` | — | público | `IndexPage.vue` | Home, apresentação, ODS e notícias. |
| `/ods` | — | público | `OdsPage.vue` | Explicação institucional da agenda ODS. |
| `/ods/:id` | — | público | `OdsDetailPage.vue` | Detalhe, metas, ações, indicadores e gráficos. |
| `/secretarias` | — | público | `SecretariasPage.vue` | Papel das secretarias e fluxo de trabalho. |
| `/transparencia` | — | público | `TransparenciaPage.vue` | Fontes, evidências e transparência. |
| `/quem-somos` | — | público | `QuemSomosPage.vue` | Propósito, metodologia e participação. |
| `/login` | `login` | somente visitante | `LoginPage.vue` | Autenticação. |
| `/admin` | `admin` | autenticado | `AdminPage.vue` | Gestão do observatório. |
| `/admin/triagem/:id` | `news-triage` | autenticado | `NewsTriagePage.vue` | Análise e conversão de notícia. |
| `/reproducao` | `reproducao` | autenticado | `ReproducaoPage.vue` | Painel de exibição/TV. |
| qualquer outra | — | público | `ErrorNotFound.vue` | Erro 404. |

O guard global:

1. inicia o loading de rota;
2. chama `auth.restoreSession()` apenas enquanto a store ainda não foi inicializada;
3. envia usuários sem sessão para `/login?redirect=...` em rotas privadas;
4. impede usuário autenticado de permanecer no login;
5. atualiza o título do documento após navegar.

Links com hash usam scroll suave e margem superior de 88 px.

## Cliente HTTP

`src/services/api.ts` contém o wrapper de `fetch`.

Comportamento:

- prefixa `VITE_API_URL`;
- envia `Accept: application/json`;
- envia `Content-Type: application/json` quando existe body;
- adiciona Bearer token quando fornecido;
- converte respostas não `2xx` em `ApiError`;
- junta arrays de mensagens do NestJS em uma única mensagem;
- retorna `undefined` em respostas `204`.

Uso esperado:

```ts
// Endpoint público
const goals = await apiRequest<Goal[]>('/goals');

// Endpoint autenticado
const indicators = await auth.request<Indicator[]>('/indicators');
```

Não concatene manualmente a URL base nas páginas. Não faça chamadas administrativas com `fetch` puro, pois isso perde o tratamento centralizado de token e `401`.

## Autenticação e sessão

`src/stores/auth-store.ts` é a única store de domínio realmente usada no estado atual.

Estado:

- `token`;
- `user`;
- `initialized`;
- `loading`.

Regras:

- login chama `POST /auth/login`;
- token é persistido em `localStorage`;
- restauração chama `GET /auth/me`;
- `401` remove a sessão e redireciona para login;
- logout limpa store e `localStorage`;
- `isAdmin` deriva do papel retornado pela API;
- esconder um botão não substitui autorização no backend.

O token em `localStorage` é uma decisão atual. Qualquer migração para cookie `HttpOnly` exige mudança coordenada no backend, CORS e cliente HTTP.

## Loading e transições

Há duas camadas de feedback de navegação:

1. `App.vue` usa `routeLoading` para exibir um overlay escuro, leve e com spinner;
2. `MainLayout.vue` mostra uma barra linear por aproximadamente 480 ms ao mudar a rota.

O serviço `route-loading.ts` mantém o overlay visível por no mínimo 280 ms, evitando flashes. Além disso, páginas podem possuir skeletons/loaders próprios para chamadas assíncronas.

Ao alterar loading:

- mantenha dimensões estáveis para evitar layout shift;
- não cubra indefinidamente a tela em caso de erro;
- prefira fade quando o conteúdo já reservou espaço;
- preserve `role="status"`, `aria-live` e rótulos acessíveis.

## Layout principal

`MainLayout.vue` contém:

- header fixo Quasar;
- logo clicável para a home;
- menus desktop e mobile;
- nome/resumo do usuário autenticado;
- login/logout;
- grupos de páginas e links institucionais;
- transição do `<router-view>`.

Os itens de menu são declarados localmente em `menuGroups`. Ao adicionar uma página, atualize rotas, menu, título e documentação em conjunto.

Observação: ainda existe no menu o texto “Gestão mock dos dados” para Admin. Ele não reflete totalmente o estado atual, pois várias seções já usam API real; trate como texto legado a revisar.

## Origem dos dados por página

O frontend foi desenvolvido com continuidade visual mesmo quando a API está indisponível. Isso é útil em demonstrações, mas exige cuidado na interpretação.

| Página | API real | Fallback ou conteúdo local |
|---|---|---|
| Home | `GET /goals`, `GET /news?limit=6` | 18 ODS locais; notícias ficam vazias; várias métricas/textos são estáticos. |
| ODS institucional | nenhuma | Conteúdo totalmente estático. |
| Detalhe do ODS | `GET /goals/:id` | `getOdsDetail()` cria metas, indicadores, observações e ações demonstrativas. |
| Secretarias | nenhuma | Conteúdo institucional estático. |
| Transparência | nenhuma | Conteúdo institucional estático. |
| Quem somos | nenhuma | Textos e números locais. |
| Login | `POST /auth/login` | Sem fallback. |
| Admin | vários endpoints administrativos | Algumas visualizações e listas começam com dados demonstrativos; falha geral mantém estado local. |
| Triagem detalhada | notícia, ODS, secretarias e indicadores | Sem fallback de negócio. |
| Reprodução | dashboard, notícias e Open-Meteo | Métricas e destaques demonstrativos quando integrações falham. |

Se uma tela precisa garantir informação oficial, ela deve distinguir explicitamente carregamento bem-sucedido de fallback. Não remova silenciosamente rótulos como “Leitura demonstrativa”.

## Tipos e fallback ODS

`src/data/ods.ts` possui:

- interfaces `Goal`, `OdsTarget`, `OdsIndicator`, `OdsObservation`, `OdsActionIndicatorLink`, `OdsAction` e `OdsDetail`;
- metadados locais dos 18 objetivos;
- seeds demonstrativos do detalhe;
- gerador de observações e ações de fallback;
- resolução das imagens `1.jpg` a `17.jpg` e `18.png`.

Este arquivo não é banco de dados. Dados criados no Admin não devem ser adicionados manualmente ao fallback como substituto da API.

Ao alterar o contrato de `GET /goals/:id`, atualize:

1. tipos em `src/data/ods.ts`;
2. `OdsDetailPayload`;
3. `normalizeOdsDetail()`;
4. fallback, se necessário;
5. documentação do backend.

## Regras de negócio refletidas na interface

### ODS, metas, indicadores e ações

```text
ODS
  -> Meta local: resultado municipal desejado
  -> Indicador: definição do que medir
     -> Observações: valores reais por período/fonte/território
  -> Ação: iniciativa que pretende influenciar indicadores
```

Não apresente uma ação como se fosse indicador. Não use quantidade de ações como prova automática de melhora social.

### Polaridade

- `HIGHER_IS_BETTER`: aumento é progresso;
- `LOWER_IS_BETTER`: redução é progresso;
- `CONTEXTUAL`: variação exige interpretação contextual.

No formulário de ação, o efeito inicial é sugerido pela polaridade:

- maior é melhor -> `INCREASE`;
- menor é melhor -> `DECREASE`;
- contextual -> `MAINTAIN`.

É uma sugestão editável, não um cálculo automático do resultado.

### Série histórica

Cada ponto exige:

- indicador;
- valor numérico normalizado;
- valor de exibição opcional;
- período;
- fonte;
- território;
- situação editorial.

O parser de número localizado aceita entradas como `78,4`, `12.480` e combinações de separadores. O número normalizado é enviado à API; a versão amigável pode ser preservada em `displayValue`.

### Ação e novo valor

Ao selecionar “Aumentar o valor” ou “Reduzir o valor”, os formulários mostram o novo valor do indicador com sua unidade.

- em publicação, o frontend exige um número válido;
- em rascunho, o campo pode ficar vazio;
- em “Manter o valor”, o campo é ocultado e limpo;
- o valor é enviado como `ActionIndicator.newValue`;
- esse valor aparece relacionado à ação no detalhe público;
- ele não cria uma observação e não modifica o gráfico oficial.

### Relevância da contribuição

O backend persiste `weight: number`, e a interface exibe:

| Valor | Rótulo | Texto usado na escolha |
|---:|---|---|
| 1 | Complementar | Contribuição pequena ou indireta para o resultado. |
| 2 | Apoio | Ajuda o indicador, mas possui alcance limitado. |
| 3 | Relevante | Contribuição perceptível e com alcance municipal. |
| 4 | Estruturante | Ação importante, contínua ou de grande abrangência. |
| 5 | Prioritária | Uma das principais ações para produzir o resultado esperado. |

A relevância não entra em cálculos atuais. Não rotule `5` como “concluída” ou `1` como “fracassada”.

## Páginas públicas

### `IndexPage.vue` — home

Responsabilidades:

- apresentar propósito e navegação;
- buscar lista de ODS;
- buscar até seis notícias públicas;
- mostrar grade interativa de objetivos;
- manter painel de detalhe selecionado;
- usar fallback de ODS se a API falhar;
- preservar altura/tempo das transições do card de detalhe;
- conduzir para `/ods/:id`.

Várias métricas da home são estáticas. Não suponha que números exibidos ali vêm do dashboard.

### `OdsPage.vue` — apresentação da agenda

É uma página institucional curta com três prioridades: leitura territorial, indicadores/metas e agenda integrada. Atualmente não consulta API nem lista os 18 cards; a exploração detalhada ocorre principalmente na home.

### `OdsDetailPage.vue` — monitoramento público

Responsabilidades:

- carregar o ODS pela rota;
- usar fallback demonstrativo em falha;
- normalizar payloads antigos em que ações podiam ser strings;
- limitar ações visíveis às três mais recentes e permitir expansão;
- exibir metas locais em grid responsivo;
- escolher indicadores com pelo menos duas observações para o gráfico;
- desenhar o gráfico SVG responsivo;
- calcular progresso/regressão com base na polaridade;
- listar ações vinculadas ao indicador e seu efeito/novo valor;
- declarar que correlação temporal não prova causalidade.

O gráfico usa `observations[]`, nunca `ActionIndicator.newValue`. A seleção padrão muda quando o indicador atual deixa de ser elegível.

### `SecretariasPage.vue`

Página institucional estática. Explica que as secretarias fornecem ações, programas e fontes; equipes técnicas validam método/período/território; e os dados entram na leitura pública.

Ela não concede nem representa autenticação de secretarias. O usuário do painel continua sendo o comitê autorizado.

### `TransparenciaPage.vue`

Página estática sobre portais oficiais, indicadores municipais e evidências/relatórios. Usa `olv-background.jpeg` no fundo e superfície translúcida para legibilidade.

### `QuemSomosPage.vue`

Página estática de propósito, pilares, metodologia e participação. Os números do hero são locais e não consultam `/dashboard`.

## Login

`LoginPage.vue`:

- mantém e-mail, senha, visibilidade de senha e mensagem de erro;
- chama a store de autenticação;
- aceita `redirect` apenas quando começa com `/`;
- usa `/admin` como destino padrão;
- exibe a mensagem normalizada da API.

## Painel administrativo

`AdminPage.vue` é o maior módulo de interface. Ele concentra tipos locais, formulários, mapeamento de enums, carregamento e nove seções.

### Carregamento compartilhado

`loadAdminData()` executa em paralelo:

- `GET /goals`;
- `GET /departments`;
- `GET /targets`;
- `GET /indicators`;
- `GET /sources`;
- `GET /observations`;
- `GET /actions`;
- `GET /news/triage`.

Como usa `Promise.all`, uma única falha rejeita o conjunto e mostra notificação. Os estados iniciais demonstrativos podem permanecer na tela. Se o painel exigir tolerância parcial, migre conscientemente para `Promise.allSettled` e indique quais blocos falharam.

`runSave()` centraliza loading, notificação, recarga e tratamento de erro para várias gravações.

O parâmetro de query `section=triagem` é reconhecido ao abrir o Admin. As demais seções são trocadas pelo estado local; query strings adicionais não são interpretadas na inicialização atual.

### Visão geral

Apresenta métricas, gráficos, cobertura, funil, últimas entradas e tarefas editoriais. Parte do conteúdo é demonstrativa/hardcoded e parte é preenchida pelos arrays carregados da API. Não use a seção como contrato exato de `/dashboard` sem refatoração.

### Triagem

- carrega todas as notícias administrativas;
- os três cards de situação funcionam como toggles;
- nenhum filtro ativo significa exibir tudo;
- múltiplos filtros podem coexistir;
- cada linha abre `/admin/triagem/:id`;
- mostra ODS sugerido, publicação, situação e eventual ação criada.

### Monitoramento ODS

Ao entrar pela primeira vez na seção, a implementação atual chama `POST /idsc/sync`, não apenas `GET /idsc/semaphore`.

- sucesso: usa os scores retornados pela sincronização;
- falha: mostra os 17 scores locais demonstrativos mais o ODS 18;
- faixas são >= 60 satisfatório, >= 50 prioritário e < 50 crítico;
- ODS 18 é local.

Se a intenção for apenas consultar ao abrir e sincronizar somente por botão, separe explicitamente os dois fluxos.

### Objetivos ODS

Monta cards a partir dos ODS e calcula contagens de metas, indicadores e fontes com os dados carregados. Os cards levam ao detalhe público do ODS.

### Indicadores

Fluxos disponíveis:

- cadastrar indicador;
- opcionalmente cadastrar o primeiro valor logo após criar;
- buscar por texto;
- filtrar por ODS;
- paginar cinco indicadores por página;
- clicar na linha para abrir o dialog;
- editar unidade de medida;
- corrigir o lançamento mais recente;
- iniciar um novo período;
- consultar data de criação, periodicidade e polaridade.

O cadastro com valor inicial faz duas requisições sequenciais:

1. `POST /indicators`;
2. `POST /observations`.

Não existe transação entre elas. Se a observação falhar, o indicador permanece criado e a UI orienta o usuário a registrar o valor pelo card.

No dialog, mudar a unidade chama `PATCH /indicators/:id` antes de salvar a observação. A verificação de duplicidade compara indicador, fonte, período e território também no cliente; o banco continua sendo a garantia final.

### Metas locais

- lista metas agrupadas por ODS;
- oferece busca e filtro por ODS;
- cria e edita em dialog;
- exclui após confirmação;
- usa códigos, prazos, prioridade e secretaria responsável;
- cards se adaptam à quantidade do grupo.

### Ações

- cria ação manual;
- escolhe secretaria, ODS e relevância textual;
- limita indicadores às opções do ODS escolhido;
- define efeito e novo valor por indicador;
- permite rascunho ou publicação;
- publicação exige ao menos um indicador e novo valor válido para aumentar/reduzir;
- lista ações carregadas.

A interface atual não oferece edição/exclusão das ações existentes, embora a API possua endpoints para isso.

### Fontes

- lista fontes carregadas;
- cadastra nome, URL, frequência, responsável técnico e reuso público;
- sempre envia o novo cadastro como `PUBLISHED`.

A interface atual não oferece edição nem exclusão de fontes.

### Lançamentos

Cria observação escolhendo indicador, ODS, território, período, valor, fonte, nota e situação.

Botões:

- salvar rascunho -> `DRAFT`;
- enviar para validação -> `REVIEW`;
- publicar -> `PUBLISHED`.

O checklist de qualidade é somente estado visual; ele não é enviado à API e não bloqueia publicação.

## Triagem detalhada de notícia

`NewsTriagePage.vue` carrega em paralelo:

- notícia selecionada;
- secretarias;
- ODS;
- indicadores publicados.

Fluxo:

1. preenche nome com o título da notícia;
2. preenche descrição com resumo, justificativa ou texto padrão;
3. sugere até três ODS;
4. permite ajustar secretaria, indicadores, efeitos, valores e relevância;
5. salva ação como rascunho ou publica;
6. alternativamente marca como não aplicável;
7. retorna ao Admin com `section=triagem`.

Regras de UI:

- no máximo três ODS;
- indicadores fora dos ODS selecionados são removidos;
- efeitos e valores de indicadores removidos são limpos;
- ação publicada exige indicador e novo valor para aumentar/reduzir;
- rascunho aceita novo valor pendente;
- notícia já convertida não mostra o formulário normal.

O backend valida novamente a conversão e sua irreversibilidade.

## Tela de reprodução

`ReproducaoPage.vue` é uma experiência independente do layout principal, protegida por autenticação e preparada para TV/painel.

Fontes:

- `/dashboard` para métricas;
- `/news?limit=8` para notícias;
- Open-Meteo para o clima de Vitória da Conquista;
- arrays locais para destaques, eixos, cards e ODS.

Comportamento:

- relógio atualizado a cada segundo;
- rotação de destaques a cada oito segundos;
- clima e notícias recarregados a cada 15 minutos;
- slides mudam a cada 15 segundos;
- setas do teclado navegam nos slides;
- suporta tela cheia e pausa;
- limpa todos os timers no unmount.

Falhas externas mantêm conteúdo demonstrativo ou ocultam a seção correspondente.

## Design system e CSS

`src/css/app.css` concentra a maior parte da identidade visual:

- header e menus;
- cards institucionais;
- páginas de secretarias/transparência;
- Admin, tabelas, dialogs, filtros e paginação;
- detalhe do ODS e gráficos;
- responsividade e estados de interação.

Convenções atuais:

- prefixo de classes próprias: `vc-`;
- cantos moderados, sombras leves e fundo verde/cinza;
- verde institucional `#1d6d13` e verde escuro no header;
- cards com bordas discretas;
- breakpoints via utilitários Tailwind e media queries;
- Material Icons pelo Quasar;
- imagens oficiais dos ODS em `assets/{id}`.

Antes de criar CSS novo, procure uma classe `vc-` equivalente. Evite estilos genéricos que vazem para todos os `article`, `table` ou componentes Quasar sem necessidade.

## Acessibilidade e UX

Ao modificar componentes:

- mantenha links e linhas clicáveis acessíveis por teclado;
- inclua `aria-label` quando o botão exibir apenas ícone;
- preserve foco visível;
- use botão para ação e link para navegação;
- não dependa somente de cor para status;
- mantenha textos alternativos de imagens;
- permita scroll horizontal apenas dentro de tabelas, não na página inteira;
- reserve altura durante loading;
- mantenha dialogs utilizáveis em viewport pequena;
- respeite singular/plural nas contagens;
- valide labels longos e unidades variadas.

## Contratos de enums com o backend

A UI apresenta português, mas envia os valores canônicos:

| UI | API |
|---|---|
| Mensal | `MONTHLY` |
| Bimestral | `BIMONTHLY` |
| Trimestral | `QUARTERLY` |
| Quadrimestral | `FOUR_MONTHLY` |
| Semestral | `SEMIANNUAL` |
| Anual | `ANNUAL` |
| Contínua | `CONTINUOUS` |
| Quanto maior, melhor | `HIGHER_IS_BETTER` |
| Quanto menor, melhor | `LOWER_IS_BETTER` |
| Contextual | `CONTEXTUAL` |
| Rascunho | `DRAFT` |
| Em revisão | `REVIEW` |
| Publicado | `PUBLISHED` |

Mapeamentos ficam atualmente em `AdminPage.vue`. Ao criar uma nova tela, não invente valores diferentes do schema Prisma.

## Fluxos ponta a ponta

### Indicador com primeiro valor

```text
Admin / Indicadores
  -> seleciona ODS, nome, unidade, frequência e polaridade
  -> opcionalmente habilita valor inicial
  -> POST /indicators
  -> POST /observations
  -> tabela recarrega
  -> detalhe público usa a observação se PUBLISHED
```

### Novo período

```text
Tabela de indicadores
  -> abre linha
  -> Novo período
  -> informa valor + fonte + período + território
  -> POST /observations
  -> série ganha novo ponto sem apagar anteriores
```

### Ação e indicador

```text
Admin / Ações ou Triagem
  -> escolhe ODS
  -> escolhe indicador daquele ODS
  -> efeito esperado
  -> novo valor associado
  -> relevância 1..5
  -> POST /actions ou POST /news/triage/:id/action
  -> detalhe do ODS mostra vínculo
  -> gráfico continua baseado nas observações
```

## Checklist para alterações por IA

- identifique se a página usa API, fallback ou ambos;
- confira o README do backend antes de mudar contratos;
- use `auth.request` em rotas privadas;
- preserve os enums canônicos enviados à API;
- não derive valor atual diretamente de uma ação;
- não elimine histórico ao editar o último lançamento;
- limpe estado dependente quando ODS/indicador for removido de uma seleção;
- mantenha validação no cliente como UX, sem assumir que ela substitui o backend;
- preserve loading, erro e estado vazio;
- teste teclado e responsividade;
- execute typecheck e build;
- atualize os dois READMEs se mudar uma regra compartilhada.

## Dívida técnica e pontos de atenção

- `AdminPage.vue` é muito grande e mistura nove módulos visuais; uma futura refatoração deve extrair componentes/composables sem alterar os contratos.
- Há dados demonstrativos espalhados por `AdminPage.vue`, `IndexPage.vue`, `data/ods.ts` e `ReproducaoPage.vue`.
- A home e páginas institucionais exibem algumas métricas estáticas.
- O detalhe do ODS cai silenciosamente para fallback quando a API falha; isso pode mascarar indisponibilidade em produção.
- O Admin usa `Promise.all`; uma falha parcial impede o preenchimento de todos os conjuntos.
- O semáforo sincroniza automaticamente ao abrir a seção, embora exista endpoint separado de consulta.
- Criar indicador com valor inicial não é transacional.
- O checklist de qualidade dos lançamentos não é persistido.
- A UI ainda não oferece todo o CRUD que o backend suporta para ações, fontes, departamentos e objetivos.
- `SecondPage.vue`, `EssentialLink.vue` e `example-store.ts` parecem remanescentes do scaffold e não fazem parte do fluxo principal.
- Tipos de API estão duplicados localmente em algumas páginas; uma camada compartilhada reduziria divergências.
- O token em `localStorage` aumenta o impacto potencial de XSS e deve ser considerado em uma revisão de segurança futura.
