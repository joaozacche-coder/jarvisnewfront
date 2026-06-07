# CLAUDE.md — Instruções Operacionais do Jarvis

> Lido automaticamente pelo Claude Code antes de qualquer tarefa.
> Contém instruções operacionais, convenções e atalhos do projeto.
> Para contexto completo do projeto, leia também: JARVIS_CONTEXT.md

---

## ⚡ Regras Operacionais (SEMPRE SIGA)

1. **Leia JARVIS_CONTEXT.md primeiro** em sessões novas para ter contexto completo
2. **Nunca leia arquivos desnecessários** — use o contexto já fornecido
3. **Um commit por feature** — nunca acumule múltiplas mudanças num commit
4. **Sempre faça commit e push** ao final de cada tarefa concluída
5. **Atualize JARVIS_CONTEXT.md** ao final de cada sessão
6. **Prompts cirúrgicos** — mexa APENAS no que foi pedido, nada mais
7. **Bugs visíveis = corrigir sem pedir permissão** — se durante a leitura do código encontrar inconsistência, CSS conflitante, ou comportamento não intencional, corrige junto com a tarefa principal e documenta no commit.
8. **Design dopaminérgico é padrão** — todo novo componente deve ter: animação de entrada (`pvFadeUp` ou similar), hover com feedback visual (lift + shadow), ação com micro-interação (scale press, confetti em milestone).
9. **Cave Mode** — lê `/Users/zacche/.claude/skills/cave-mode/SKILL.md` antes de qualquer tarefa

---

## 📁 Mapa de Arquivos (não leia o que não precisa)

### Backend (`/Users/zacche/Downloads/jarvisIA-main`)
| Arquivo | Quando ler |
|---|---|
| `api.py` | Mudanças no chat, ferramentas, rotas |
| `prompts.py` | Mudanças de personalidade/tom |
| `supabase_client.py` | Mudanças no banco de dados |
| `agent.py` | Mudanças no agente de voz LiveKit |
| `automacao_jarvis.py` | NÃO TOCAR — legacy Windows |

### Frontend (`/Users/zacche/Desktop/jarvisnewfront`)
| Arquivo | Quando ler |
|---|---|
| `public/index.html` | Mudanças no chat, visual, componentes, telas internas |
| `src/app/api/chat/route.ts` | Mudanças no proxy do chat |
| `src/app/api/token/route.ts` | Mudanças no LiveKit token |
| `src/app/api/clients/route.ts` | Mudanças no proxy de clientes |
| `src/app/api/tasks/route.ts` | Mudanças no proxy de tarefas |
| `src/app/api/tasks/[id]/route.ts` | Mudanças no proxy de tarefas por ID |
| `src/app/api/context/route.ts` | Mudanças no proxy de contexto vivo |

---

## 🚀 Deploy

### Backend (Railway)
```bash
cd /Users/zacche/Downloads/jarvisIA-main
git add .
git commit -m "tipo: descrição curta"
git push
# Railway faz deploy automático
```

### Frontend (Vercel)
```bash
cd /Users/zacche/Desktop/jarvisnewfront
git add .
git commit -m "tipo: descrição curta"
git push
# Vercel faz deploy automático
```

---

## 🎨 Convenções de Código

### Frontend (index.html)
- Fundo escuro/espacial — NUNCA mudar cores base
- Orb de partículas some ao iniciar chat (classe `.has-chat`)
- Textarea com auto-resize (min 1 linha, max 4 linhas)
- Animações: `fadeUp` para novas mensagens, `blink` para loading dots
- Sidebar: 56px de largura, ícones Tabler outline
- Cor primária: `#534AB7` (roxo)

### Backend (api.py)
- Ferramentas do Supabase + contexto vivo juntas em `TOOLS`
- `OBSIDIAN_TOOL_NAMES` não existe mais — foi removido
- Contexto vivo: título sempre `"contexto: NomeEntidade"`
- Entidades conhecidas: Gracie Barra, SoHo, DDpartssolution, Jarvis, autoescola, faculdade, financeiro

### Commits
```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração sem mudança de comportamento
docs: documentação
style: mudança visual sem lógica
```

---

## ❌ O Que NUNCA Fazer

- Não mudar o layout geral do frontend (sidebar, orb, cores base)
- Não tocar em `automacao_jarvis.py`
- Não criar novos arquivos de integração Obsidian (foi removido)
- Não instalar dependências sem necessidade
- Não refatorar código que não foi pedido
- Não fazer múltiplas mudanças num único prompt

---

## 💡 Atalhos de Contexto

Em vez de ler arquivos inteiros, use estas referências rápidas:

**"Como o chat funciona?"**
→ `public/index.html`: função `submit()` envia para `/api/chat` → `src/app/api/chat/route.ts` → Railway `/chat`

**"Como a tela de Tarefas funciona?"**
→ `public/index.html`: `TasksView` (React.createElement) → `/api/tasks` → Railway `/tasks`

**"Como a tela de Clientes funciona?"**
→ `public/index.html`: `ClientsView` com `_FIXED_CLIENTS` base → `/api/clients` + `/api/context?name=X` → Railway `/clients` e `/context`

**"Como o Jarvis decide o que fazer?"**
→ `api.py`: Gemini recebe system prompt + ferramentas → function calling → `_executar_ferramenta()`

**"Como o banco funciona?"**
→ `supabase_client.py`: 6 tabelas, tudo passa pela tabela `entries` com `type` + `content` JSONB

**"Como fazer deploy?"**
→ `git add . && git commit -m "..." && git push` em qualquer pasta — auto-deploy configurado

---

## 🔧 Comandos Úteis

```bash
# Ver logs do Railway em tempo real
railway logs

# Testar backend local
cd /Users/zacche/Downloads/jarvisIA-main
uvicorn api:app --reload

# Testar frontend local
cd /Users/zacche/Desktop/jarvisnewfront
npm run dev

# Compactar contexto quando sessão estiver longa
/compact
```

---

## 🗺️ Mapa index.html (`public/index.html` — 5110 linhas)

> Use este mapa para ir direto à linha certa sem ler o arquivo.

### CSS — Blocos por Seção
| Linha | Seção |
|---|---|
| 36 | App geral (variáveis, reset) |
| 46 | Background partículas |
| 59 | Orb ambiente (`.orb`, `.has-chat`) |
| 91 | Sidebar (`.sidebar-*`) |
| 179 | Main stage |
| 186 | Hero / greeting |
| 239 | Input pill + Composer |
| 338 | Status line (voz) |
| 358 | Animações globais |
| 365 | Chat feed (`.msg-*`) |
| 445 | **Tasks View** (`.tv-*`) |
| 627 | **CRM / Clients View** (`.crm-*`) |
| 753 | **Finance View** (`.fin-*`) |
| 962 | **Agenda View** (`.ag-*`) |
| 1188 | **Personal View** (`.pv-*`) |
| 1212 | Regra: botões sempre visíveis |
| 1273 | Senhas pills |
| 1318 | Metas (`.pv-goal-*`) |

### Componentes React — Funções
| Linha | Componente / Função |
|---|---|
| 1574 | `useTweaks(defaults)` — hook de tweaks visuais |
| 1607 | `TweaksPanel` — painel de ajuste visual |
| 1706 | `TweakSection`, `TweakRow` |
| 1731 | `TweakSlider`, `TweakToggle`, `TweakRadio` |
| 1858 | `TweakSelect`, `TweakText`, `TweakNumber` |
| 1983 | `TweakColor`, `TweakButton` |
| 2068 | `Particles` — canvas de partículas de fundo |
| 2240 | `VoiceOrb` — orb animado (canvas WebGL) |
| 2512 | `hexA(hex, a)` — util cor com alpha |
| 2529 | `ICONS` — mapa de ícones globais |
| 2658 | `Icon` — wrapper de ícone |
| 2666 | `NAV` — config itens da nav |
| 2691 | `greetingEyebrow()` — saudação dinâmica |
| 2696 | `stripMd(txt)` — remove markdown |
| 2704 | `CopyBtn` — botão copiar texto |
| 2719 | `Sidebar` — sidebar 56px com nav |
| 2757 | `Composer` — textarea com auto-resize |
| 2833 | `CountUp` — animação numérica |
| **2850** | **`FinanceView()`** — tela financeiro |
| **3300** | **`AgendaView({onChat})`** — tela agenda |
| **3776** | **`PersonalView({onChat})`** — tela pessoal |
| **4547** | **`TasksView()`** — tela tarefas |
| **4857** | **`App()`** — componente raiz |
| 5107 | `ReactDOM.createRoot` — mount |

### FinanceView (L2850) — Estado + Funções
**Estado (L2852):** `txns`, `loading`, `period`, `listVisible`, `showModal`, `editId`, `modalType`, `modalAmount`, `modalCat`, `modalDesc`, `newIds`, `dyingIds`, `deleteId`, `balFlash`, `confetti`, `pageSize`, `chartVisible`

| Linha | Função |
|---|---|
| 2933 | `periodStart()` |
| 2965 | `fmtAmt(isIncome, n)` |
| 2989 | `fireConfetti()` |
| 3004 | `closeModal()` |
| 3019 | `submitTx()` |
| 3078 | render skeleton |
| 3097 | render cards |
| 3116 | render chart |
| 3143 | render list |
| 3218 | render modal |

### AgendaView (L3300) — Estado + Funções
**Estado (L3332):** `view`, `curDate`, `weekStart`, `curMonth`, `selDay`, `events`, `loading`, `slideDir`, `viewFade`, `prevView`, `showModal`, `editId`, `mTitle/mDate/mStart/mEnd/mColor/mDesc`, `saving`, `newIds`, `dying`, `nowStr`, `briefText/briefDisp/briefLoad/briefOpen/briefUpdatedAt`

| Linha | Função |
|---|---|
| 3382 | `fetchBriefing()` |
| 3475 | `renderMonth()` |
| 3511 | `renderWeek()` |
| 3570 | `renderBriefing()` |
| 3633 | `renderDay()` |
| 3685 | `renderModal()` |
| 3717 | `renderSkeleton()` |

### PersonalView (L3776) — Constantes
| Linha | Constante |
|---|---|
| 3778 | `TABS` — abas (notes, links, passwords, kanban, goals, profile) |
| 4110 | `LINK_CATS`, `CAT_COLOR` |
| 4112 | `K_COLS` — colunas kanban (todo/doing/done) |
| 4113 | `PROF_SECS` — seções do perfil |
| 4120 | `NOTE_TAG_COLORS` |
| 4512 | `ACTION` — mapa aba→modal de criação |

### PersonalView (L3776) — Estado (L3786–3842)
`tab`, `tabAnim`, `loading`, `notes`, `noteSearch`, `selNote`, `links`, `passwords`, `pwDecrypted/pwVisible/pwCopied`, `kanban`, `dragId/dragOver`, `newCardCol/newCardTxt`, `goals`, `expGoal`, `profileData/profileId/editField/profSaving`, `modal`, `noteForm/linkForm/pwForm/goalForm`, `newIds`, `tagFilter`, `pwDelConfirm/pwRevealAt/pvTick`, `editPw/pwEditForm/pwEditLoading`, `confettiPcs`, `noteSaving/noteTagsArr/noteTagInput`, `editNote/noteDelConfirm/noteDelExiting/noteDying`, `linkDelConfirm/linkDelExiting/linkDying`, `editLink/linkEditForm`, `pwDelModal/pwDelModalExit`, `kDelConfirm/kDelExiting/kEditCard/kEditTxt`, `goalDelConfirm/goalDelExiting/goalEditForm`

### PersonalView — Funções Async (L3852–4101)
| Linha | Função |
|---|---|
| 3852 | `loadTab(t)` — carrega dados da aba |
| 3874 | `switchTab(t)` |
| 3880 | `highlight(id)` |
| 3885 | `api(path, method, body)` — fetch wrapper |
| 3897 | `encrypt(text)` / `decrypt(cipher)` |
| 3916 | `saveNote()` / `saveNoteEdit()` / `deleteNote(id)` |
| 3945 | `saveLink()` / `deleteLink(id)` / `saveLinkEdit()` |
| 3966 | `savePw()` / `getDecrypted(pw)` / `revealPw(pw)` |
| 3988 | `copyPw(pw,type)` / `deletePw(id)` / `openPwEdit(pw)` / `savePwEdit()` |
| 4015 | `createCard(col)` / `moveCard(id,from,to)` / `deleteCard(id,col)` |
| 4031 | `fireConfetti(anchorEl)` / `fireGoalConfetti(anchorEl)` |
| 4062 | `saveGoal()` / `updateProgress(id,val)` / `deleteGoal(id)` / `saveGoalEdit()` |
| 4085 | `renameCard()` / `saveField(field,val)` / `saveAll()` |
| 4106 | `fmtDate(iso)` / `daysUntil(s)` / `getDomain(url)` |

### PersonalView — Renders (L4123–4512)
| Linha | Render |
|---|---|
| 4123 | `renderNotes()` |
| 4226 | `pwStrength(pw)` |
| 4235 | `renderPasswords()` |
| 4344 | `fmtNoteDate(iso)` / `fmtRelDate(iso)` |
| 4364 | `renderGoals()` |
| 4416 | `renderProfile()` |
| 4442 | `renderModal()` |

### PersonalView — Modais (`modal` state)
| Valor | Modal |
|---|---|
| `'note'` | Nova Nota |
| `'note-edit'` | Editar Nota |
| `'link'` | Novo Link |
| `'link-edit'` | Editar Link |
| `'password'` | Nova Senha |
| `'edit-password'` | Editar Senha |
| `'kanban-edit'` | Editar Card Kanban |
| `'goal'` | Nova Meta |
| `'goal-edit'` | Editar Meta |

### TasksView (L4547) — Estado + Funções
**Estado (L4549):** `tasks`, `loading`, `tab`, `dying`, `showModal`, `newTitle`, `newPriority`, `newDue`, `newTag`, `creating`

**Constantes:** `PRIO` (L4619), `KNOWN_CLIENTS` (L4636), `TABS` (L4687)

| Linha | Função |
|---|---|
| 4580 | `toggle(task)` |
| 4598 | `createTask()` |
| 4625 | `getPrio(t)` / `extractClient(title)` / `getTag(t,ec)` |
| 4653 | `fmtAge(created_at)` / `fmtDue(due)` / `isLate(due,status)` |

### App (L4857) — Estado + Funções
**Estado (L4858):** `t` (tweaks), `active`, `input`, `orbState`, `mounted`, `inputFocused`, `messages`, `isThinking`

| Linha | Função |
|---|---|
| 4911 | `submit(text)` — envia mensagem ao chat |
| 4936 | `onMicToggle()` — toggle microfone LiveKit |

### Rotas de API Usadas
| Rota | Método | Quem usa |
|---|---|---|
| `/api/chat` | POST (stream) | `App.submit()` + `AgendaView.fetchBriefing()` |
| `/api/token` | GET | `App.onMicToggle()` |
| `/api/transactions` | GET/POST/PATCH/DELETE | `FinanceView` |
| `/api/events` | GET/POST/PATCH/DELETE | `AgendaView` |
| `/api/personal` | GET/POST/PATCH/DELETE | `PersonalView` (notas, links, senhas, kanban, metas, perfil) |
| `/api/tasks` | GET/POST/PATCH/DELETE | `TasksView` |

---

## 📊 Stack Resumida

```
Frontend:  Next.js + HTML standalone (Vercel)
Backend:   Python FastAPI (Railway)
Banco:     Supabase PostgreSQL
Memória:   Mem0
LLM:       Gemini 2.5 Flash
Voz:       LiveKit (configurado, não integrado ao front)
```
