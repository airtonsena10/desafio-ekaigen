# Sistema de Inspeções

Aplicação web para controle de inspeções de equipamentos, desenvolvida como desafio técnico. Permite criar inspeções, preencher checklist, encaminhar para revisão e aprovar/reprovar — com visões em **lista** e **Kanban**.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4** + **shadcn/ui**
- **Vitest** + **Testing Library** (testes unitários, de hooks e de UI)
- **Biome** (lint/format)
- **pnpm** (gerenciador de pacotes)
- Persistência em **localStorage** (mock assíncrono)

## Pré-requisitos

- **Node.js** 20+
- **pnpm** 10+ (`corepack enable` ou `npm i -g pnpm`)

## Instalação

```bash
git clone https://github.com/airtonsena10/desafio-ekaigen.git
cd desafio-ekaigen
pnpm install
```

Variáveis de ambiente são opcionais (veja [Simular falhas e restaurar dados](#simular-falhas-e-restaurar-dados)). Se quiser configurá-las, crie um `.env.local` na raiz do projeto.

## Execução

### Desenvolvimento

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000). A rota raiz redireciona para `/inspecoes`.

### Produção local

```bash
pnpm build
pnpm start
```

### Lint e formatação

```bash
pnpm lint
pnpm format
```

## Testes e cobertura

```bash
# modo watch
pnpm test

# execução única
pnpm test:run

# cobertura (domain + services + hooks)
pnpm test:coverage
```

### Metas de cobertura

Configuradas em `vitest.config.ts` para `src/domain/**`, `src/services/**` e `src/hooks/**`:

| Métrica   | Mínimo |
|-----------|--------|
| Lines     | 80%    |
| Branches  | 80%    |

### Resultado atual (referência)

| Métrica    | Valor  |
|------------|--------|
| Testes     | 39     |
| Arquivos   | 9      |

Cobertura concentrada em domínio, serviços e hooks testados; componentes de UI têm testes de comportamento essenciais em `inspection-ui.test.tsx`.

## Funcionalidades

| Rota | Descrição |
|------|-----------|
| `/inspecoes` | Lista com busca, filtros, criação de inspeção e modal de detalhe |
| `/inspecoes/kanban` | Kanban por status (tabs no mobile, colunas no desktop) |
| `/inspecoes/[id]` | Detalhe direto por URL (deep link) |

### Papéis simulados

No header, alterne entre **Inspetor** e **Revisor**:

- **Inspetor:** cria, edita rascunho, encaminha para revisão, reenvia após reprovação
- **Revisor:** aprova ou reprova inspeções em `em_aprovacao` (fluxo em duas etapas com confirmação)

### Criação e edição

- Formulário de **nova inspeção** com validação e toast listando campos obrigatórios faltantes
- **Auto-save** de rascunho ao sair dos campos e ao alterar o checklist
- Metadados editáveis (equipamento, setor, responsável, data) no detalhe
- Checklist com barra de progresso, modo leitura com badges e observação obrigatória em respostas "Não"

### Filtros

- Contadores de status no header são **clicáveis** (filtram lista/kanban)
- Busca e filtro por status na toolbar de cada visão
- Estado sincronizado na URL (`?status=` e `?q=`)
- No Kanban mobile, abas de status são independentes do filtro "Todos os status"

## Simular falhas e restaurar dados

### Variáveis de ambiente

Crie `.env.local` na raiz (opcional):

```env
NEXT_PUBLIC_SIMULATE_DELAY_MS=300
NEXT_PUBLIC_SIMULATE_FAILURE=false
```

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SIMULATE_DELAY_MS` | Atraso artificial (ms) em toda operação de dados |
| `NEXT_PUBLIC_SIMULATE_FAILURE` | `true` força falha nas próximas operações |

> Reinicie o servidor (`pnpm dev`) após alterar o `.env.local`.

### Painel de simulação (somente desenvolvimento)

Com `pnpm dev`, use o botão **Simulação** no header:

1. **Atraso (ms)** — simula latência de rede (ex.: `800` deixa skeletons visíveis)
2. **Simular falha** — próximas operações lançam erro controlado
3. **Aplicar** — persiste configuração em runtime e fecha o modal
4. **Reset** — volta aos valores do `.env.local`
5. **Restaurar mock** — recarrega dados seed e limpa seleção atual

### O que é afetado pela simulação

Todas as operações assíncronas do repositório passam por `simulateAsyncOperation`:

- listar inspeções
- criar / salvar rascunho
- aprovar / reprovar / reenviar
- restaurar mock

Em falha simulada, a UI exibe estado de erro amigável com botão **Tentar novamente**.

### Restaurar dados manualmente

- Pelo painel: **Restaurar mock**
- Pelo navegador: limpar `localStorage` (chave `inspecoes-app-data`) e recarregar a página

Dados inválidos no `localStorage` são descartados via validação runtime em `persistence.schema.ts`.

## Estrutura do projeto

```
src/
├── app/                         # Rotas Next.js
├── components/
│   ├── inspections/             # Lista, Kanban, detalhe, checklist, shell compartilhado
│   ├── layout/                  # Shell e header
│   └── dev/                     # Painel de simulação
├── domain/                      # Regras de negócio puras (sem React)
│   ├── inspection.types.ts      # Tipos e checklist seed
│   ├── inspection.transitions.ts# Máquina de estados
│   ├── inspection.validation.ts # Validações de negócio
│   ├── inspection.draft.ts      # Payload e serialização de rascunho
│   ├── inspection.queries.ts    # Filtros, contagens e agrupamento
│   └── inspection.permissions.ts# Visibilidade de ações por papel/status
├── hooks/                       # Lógica de aplicação reutilizável
│   ├── use-inspection-form.ts   # Formulário, auto-save e ações
│   ├── use-inspection-modal.ts  # Modal + inspeção selecionada
│   ├── use-filtered-inspections.ts
│   ├── use-inspection-by-id.ts  # Deep link via provider
│   └── use-inspection-filters.ts
├── lib/                         # Utilitários (erros, datas, flush de campo)
├── providers/                   # Contextos React (inspeções, papel)
└── services/                    # Repositório, persistência, mock, simulação
    └── persistence.schema.ts    # Validação runtime do localStorage
```

## Fluxo de estados

```
em_preenchimento → em_aprovacao → aprovada
                        ↓
                    reprovada → em_aprovacao (reenvio)
```

Regras de transição, validação de checklist e permissões por papel ficam em `src/domain/`.

## Premissas

1. **Sem backend real** — dados mockados com persistência local; suficiente para demonstrar fluxo e UX.
2. **Autenticação simulada** — troca de papel (Inspetor/Revisor) via toggle no header, sem login.
3. **Checklist fixo** — 3 perguntas padronizadas (Sim/Não + observação obrigatória em "Não").
4. **Uso em campo** — prioridade para mobile (checklist touch-friendly, Kanban em tabs, modal fullscreen).
5. **Cobertura focada** — testes com meta ≥ 80% em domínio, serviços e hooks; UI com testes de comportamento essenciais.

## Decisões técnicas

| Decisão | Motivo |
|---------|--------|
| Domínio puro em `src/domain/` | Regras testáveis sem React; máquina de estados isolada |
| Hooks de aplicação (`use-inspection-form`, etc.) | Separa lógica de estado/ações da composição visual |
| `InspectionViewShell` compartilhado | Lista e Kanban reutilizam toolbar, filtros, loading e modal |
| Repositório assíncrono + `simulateAsyncOperation` | Reproduz latência/falha de API sem servidor |
| `parsePersistedState` no load | Evita `as PersistedState`; descarta JSON corrompido |
| localStorage | Persistência entre reloads; seed automático na 1ª visita |
| Biome no lugar de ESLint | Lint + format unificados, setup mais enxuto |
| Filtros na URL (`useSearchParams`) | Compartilhável, sincroniza header e views |
| Modal centralizado (não Sheet lateral) | Melhor foco no mobile e no checklist |
| shadcn/ui + tokens semânticos por status | Consistência visual e contraste acessível (AA) |
| `refreshing` separado de `loading` | Refresh não esconde conteúdo já carregado |
| Auto-save com diff por snapshot | Evita writes redundantes no repositório |

## Limitações

- Dados **não são compartilhados** entre dispositivos ou usuários
- Papel do usuário **não é persistido** (reinicia como Inspetor ao recarregar)
- Simulação de falha é **global** — afeta a próxima operação, não endpoints individuais
- Sem paginação; volume pensado para dezenas de inspeções
- Painel de simulação **oculto em produção** (`NODE_ENV === "production"`)

## Deploy (Vercel)

1. Importe o repositório na [Vercel](https://vercel.com)
2. Framework preset: **Next.js**
3. Build command: `pnpm build`
4. Install command: `pnpm install`
5. (Opcional) Configure as variáveis de simulação — em produção o painel dev não aparece

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Servidor de produção |
| `pnpm lint` | Verificação Biome |
| `pnpm format` | Formatação Biome |
| `pnpm test` | Vitest (watch) |
| `pnpm test:run` | Vitest (CI) |
| `pnpm test:coverage` | Cobertura domain + services + hooks |

## Licença

Projeto privado — desafio técnico eKaizen.
