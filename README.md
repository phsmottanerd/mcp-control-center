from pathlib import Path

svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="330" viewBox="0 0 1200 330" role="img" aria-labelledby="title desc">
  <title id="title">MCP Control Center — Mainframe Automation Cybersecurity</title>
  <desc id="desc">Animated neon green mainframe control center header.</desc>

  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <linearGradient id="scan" x1="0" x2="1">
      <stop offset="0%" stop-color="#00ff41" stop-opacity="0"/>
      <stop offset="50%" stop-color="#00ff41" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#00ff41" stop-opacity="0"/>
    </linearGradient>

    <style>
      .green { fill:#00ff41; font-family:monospace; text-anchor:middle; }
      .title { font-size:48px; font-weight:800; letter-spacing:5px; }
      .main { font-size:22px; font-weight:700; letter-spacing:2px; }
      .status { font-size:20px; font-weight:700; letter-spacing:3px; }
      .small { font-size:14px; letter-spacing:4px; }
      .line { stroke:#00ff41; stroke-width:2; fill:none; opacity:.65; }
      .glow { filter:url(#glow); }
      .soft { filter:url(#softGlow); opacity:.22; }
    </style>
  </defs>

  <!-- Dark terminal background -->
  <rect width="1200" height="330" rx="18" fill="#050805"/>

  <!-- Subtle scanline grid -->
  <g opacity=".10" stroke="#00ff41">
    <path d="M40 55H1160 M40 95H1160 M40 135H1160 M40 175H1160 M40 215H1160 M40 255H1160 M40 295H1160"/>
    <path d="M100 35V310 M200 35V310 M300 35V310 M400 35V310 M500 35V310 M600 35V310 M700 35V310 M800 35V310 M900 35V310 M1000 35V310 M1100 35V310"/>
  </g>

  <!-- Decorative frame -->
  <path class="line glow" d="M40 55V35H180 M1020 35H1160V55 M40 275V295H180 M1020 295H1160V275"/>
  <path class="line" d="M260 35H940 M260 295H940"/>

  <!-- Soft ambient glow -->
  <ellipse cx="600" cy="135" rx="420" ry="80" fill="#00ff41" class="soft">
    <animate attributeName="opacity" values=".08;.25;.08" dur="4s" repeatCount="indefinite"/>
  </ellipse>

  <!-- Main title -->
  <text x="600" y="105" class="green title glow">
    MCP CONTROL CENTER
    <animate attributeName="opacity" values="0;1;1;0" dur="7s" repeatCount="indefinite"/>
  </text>

  <!-- Main technology line -->
  <text x="600" y="155" class="green main glow">
    MAINFRAME • AUTOMATION • CYBERSECURITY
    <animate attributeName="opacity" values="0;1;1;0" dur="7s" begin=".8s" repeatCount="indefinite"/>
  </text>

  <text x="600" y="190" class="green main glow">
    JAVA • COBOL • PYTHON • GENERATIVE AI
    <animate attributeName="opacity" values="0;1;1;0" dur="7s" begin="1.6s" repeatCount="indefinite"/>
  </text>

  <!-- Status -->
  <rect x="365" y="215" width="470" height="45" rx="8" fill="none" stroke="#00ff41" stroke-width="2" opacity=".65">
    <animate attributeName="opacity" values=".25;.9;.25" dur="2.4s" repeatCount="indefinite"/>
  </rect>

  <circle cx="395" cy="237" r="6" fill="#00ff41" filter="url(#glow)">
    <animate attributeName="opacity" values=".2;1;.2" dur="1.2s" repeatCount="indefinite"/>
  </circle>

  <text x="610" y="244" class="green status glow">
    SYSTEM STATUS: ONLINE
    <animate attributeName="opacity" values=".35;1;.35" dur="2.4s" repeatCount="indefinite"/>
  </text>

  <!-- Bottom terminal message -->
  <text x="600" y="285" class="green small">
    [ SYSTEM INITIALIZATION COMPLETE ]
    <animate attributeName="opacity" values="0;1;1;0" dur="6s" begin="2.5s" repeatCount="indefinite"/>
  </text>

  <!-- Moving scan beam -->
  <rect x="80" y="270" width="180" height="2" fill="url(#scan)" filter="url(#glow)">
    <animate attributeName="x" from="80" to="940" dur="3.5s" repeatCount="indefinite"/>
  </rect>
</svg

## 🟢 Sobre o Projeto

O **MCP Control Center** é uma plataforma experimental de desenvolvimento criada para integrar tecnologias de **Backend, Frontend, automação, Linux, Mainframe, controle de versão e Inteligência Artificial Generativa** em um único ambiente técnico.

O projeto combina tecnologias tradicionais do ambiente corporativo, como **COBOL e conceitos Mainframe**, com tecnologias modernas como **Java, Spring Boot, Python, JavaScript e IA Generativa**.

A proposta é construir uma arquitetura que possa evoluir para um verdadeiro **Control Center de operações, automação e processamento técnico**.

</font>

---

<div align="center">

<font color="#00FF41">

## 🟢 TECHNOLOGY STACK

| Tecnologia | Função |
|---|---|
| ☕ Java | Backend e lógica da aplicação |
| 🍃 Spring Boot | APIs e serviços |
| 🟢 COBOL | Mainframe e processamento Batch |
| 🐍 Python | Automação e processamento |
| ⚡ JavaScript | Interatividade |
| 🌐 HTML5 | Estrutura Frontend |
| 🎨 CSS3 | Interface visual |
| 🐧 Linux / WSL | Ambiente operacional |
| ⌨️ Terminal | Administração e execução |
| 📦 Maven | Build e dependências |
| 🔧 Git | Versionamento |
| 🐙 GitHub | Repositório |
| 💻 VS Code | Desenvolvimento |
| 🤖 Generative AI | Assistência de engenharia |

</font>

</div>

---

<font color="#00FF41">

## 🟢 Arquitetura

A arquitetura do projeto foi pensada para conectar diferentes camadas tecnológicas:

```text
Frontend
   │
   ├── HTML
   ├── CSS
   └── JavaScript
          │
          ▼
Backend
   │
   ├── Java
   └── Spring Boot
          │
          ▼
Automation
   │
   ├── Python
   └── COBOL
          │
          ▼
Operating Environment
   │
   └── Linux / WSL
          │
          ▼
Development Infrastructure
   │
   ├── Terminal
   ├── Git
   ├── GitHub
   ├── Maven
   └── VS Code
          │
          ▼
Generative AI
```

A arquitetura permite trabalhar com diferentes tecnologias dentro de um mesmo fluxo de desenvolvimento.

</font>

---

<font color="#00FF41">

## 🟢 Java ☕

Java é uma das principais tecnologias utilizadas no Backend do projeto.

A linguagem é responsável pela implementação da aplicação, organização das classes, modelos, métodos e regras de negócio.

### Conceitos utilizados

- Classes
- Objetos
- Métodos
- Pacotes
- Encapsulamento
- Organização modular
- APIs
- Processamento Backend

O projeto utiliza o pacote principal:

```text
com.paulohenrique.mcp_control_center
```

A estrutura Java foi criada para permitir a evolução da aplicação para novos módulos e serviços.

</font>

---

<font color="#00FF41">

## 🟢 Spring Boot 🍃

O Spring Boot fornece a estrutura principal do Backend.

A utilização do framework permite organizar a aplicação em componentes responsáveis por receber requisições, processar informações e retornar respostas.

### Principais conceitos

- Application
- Controllers
- Models
- Services
- REST
- Endpoints
- Dependency Management

Um dos recursos desenvolvidos no projeto está relacionado ao endpoint:

```text
GET /professores
```

A arquitetura pode ser expandida posteriormente para outros módulos do Control Center.

</font>

---

<font color="#00FF41">

## 🟢 COBOL / Mainframe

COBOL representa uma das conexões mais importantes do projeto com o universo **Mainframe e sistemas corporativos**.

A utilização de COBOL no contexto do projeto está relacionada a conceitos de:

- processamento Batch;
- processamento de registros;
- sistemas corporativos;
- processamento sequencial;
- integração com automação;
- arquitetura Mainframe.

### Ecossistema relacionado

```text
IBM Z
z/OS
JCL
CICS
Db2
USS
VSAM
Batch Processing
```

A proposta é aproximar tecnologias tradicionais de processamento corporativo de ferramentas modernas de desenvolvimento e automação.

</font>

---

<font color="#00FF41">

## 🟢 Python 🐍

Python é utilizado como tecnologia complementar para automação e processamento.

Sua utilização permite desenvolver ferramentas auxiliares para:

- processamento de arquivos;
- CSV;
- geração de relatórios;
- automação;
- processamento de dados;
- execução de tarefas;
- integração entre processos.

Python também pode atuar como camada de automação entre diferentes componentes do ambiente.

</font>

---

<font color="#00FF41">

## 🟢 JavaScript ⚡

JavaScript é utilizado na camada de interação do Frontend.

Entre suas responsabilidades estão:

- eventos da interface;
- interação com componentes;
- comunicação com APIs;
- requisições HTTP;
- atualização dinâmica;
- controle da interface.

Fluxo básico:

```text
USUÁRIO
   ↓
JAVASCRIPT
   ↓
HTTP REQUEST
   ↓
SPRING BOOT
   ↓
JAVA
   ↓
RESPONSE
   ↓
JAVASCRIPT
   ↓
INTERFACE
```

</font>

---

<font color="#00FF41">

## 🟢 HTML5 🌐

HTML5 representa a estrutura da interface.

Pode ser utilizado para organizar:

- Header
- Navigation
- Dashboard
- Panels
- Forms
- Tables
- Buttons
- Menus
- Áreas de controle

O HTML fornece a estrutura sobre a qual JavaScript e CSS trabalham.

</font>

---

<font color="#00FF41">

## 🟢 CSS3 🎨

CSS é responsável pela apresentação visual do projeto.

A identidade visual proposta para o MCP Control Center utiliza uma linguagem inspirada em:

- Mainframe;
- Terminal;
- Cybersecurity;
- Control Centers;
- interfaces industriais;
- painéis técnicos;
- sistemas operacionais;
- ambientes corporativos.

### Direção visual

**Dark Interface + Terminal Green + Cyber UI + Depth + Glow**

A intenção é criar uma interface tecnológica e operacional, evitando uma aparência genérica de aplicação web.

</font>

---

<font color="#00FF41">

## 🟢 Linux / WSL 🐧

O ambiente de desenvolvimento utiliza Linux através do **Windows Subsystem for Linux (WSL)**.

O WSL permite utilizar ferramentas e comandos Linux diretamente no ambiente Windows.

### Ambiente

```text
Windows
   │
   ▼
WSL
   │
   ▼
Linux
   │
   ├── Java
   ├── Maven
   ├── Python
   ├── Git
   ├── COBOL
   └── Terminal
```

O ambiente Linux também aproxima o desenvolvimento das condições encontradas em servidores, infraestrutura, automação e ambientes corporativos.

</font>

---

<font color="#00FF41">

## 🟢 Terminal ⌨️

O Terminal é parte fundamental do desenvolvimento.

Comandos utilizados no fluxo de trabalho incluem:

```bash
pwd
cd
ls
mkdir
git status
git add
git commit
git push
java
mvn
python
```

O Terminal é utilizado para:

- navegar pelo projeto;
- criar arquivos e diretórios;
- executar aplicações;
- compilar;
- testar;
- diagnosticar problemas;
- administrar o ambiente Linux;
- trabalhar com Git.

</font>

---

<font color="#00FF41">

## 🟢 Maven 📦

Maven é utilizado no gerenciamento do projeto Java.

Suas principais responsabilidades incluem:

- gerenciamento de dependências;
- compilação;
- testes;
- empacotamento;
- ciclo de vida da aplicação.

Arquivo principal:

```text
pom.xml
```

O Maven centraliza informações necessárias para construção e gerenciamento do Backend.

</font>

---

<font color="#00FF41">

## 🟢 Git 🔧

Git é utilizado para controle de versão.

Fluxo básico:

```text
WORKSPACE
    ↓
git status
    ↓
git add
    ↓
git commit
    ↓
git push
    ↓
GITHUB
```

O Git permite:

- registrar alterações;
- manter histórico;
- recuperar versões;
- controlar branches;
- preparar o código para publicação;
- acompanhar a evolução do projeto.

</font>

---

<font color="#00FF41">

## 🟢 GitHub 🐙

GitHub é utilizado como repositório remoto e plataforma de publicação do projeto.

O repositório:

```text
mcp-control-center
```

utiliza a branch principal:

```text
main
```

O GitHub também funciona como vitrine técnica para apresentar a arquitetura, tecnologias e evolução do projeto.

</font>

---

<font color="#00FF41">

## 🟢 Visual Studio Code 💻

O Visual Studio Code é utilizado como ambiente de desenvolvimento.

O projeto pode ser trabalhado dentro do editor utilizando:

- Java;
- Spring Boot;
- JavaScript;
- HTML;
- CSS;
- Python;
- COBOL;
- Terminal;
- Git.

A integração entre editor, Terminal e Git permite executar grande parte do ciclo de desenvolvimento dentro do mesmo ambiente.

</font>

---

<div align="center">

<font color="#00FF41">

# 🤖 GENERATIVE AI

### INTELLIGENCE ASSISTING THE DEVELOPMENT PROCESS

</font>

</div>

<font color="#00FF41">

## 🟢 Inteligência Artificial Generativa

A **IA Generativa é uma parte importante do processo de desenvolvimento do MCP Control Center**.

Ela é utilizada como ferramenta de apoio à engenharia de software, aprendizado, análise e resolução de problemas.

### Aplicações

- assistência na programação;
- análise de código;
- debugging;
- documentação;
- arquitetura;
- refatoração;
- investigação de erros;
- explicação de conceitos;
- aprendizagem tecnológica;
- apoio à implementação.

Fluxo de desenvolvimento assistido:

```text
DESENVOLVEDOR
      ↓
PROBLEMA
      ↓
IA GENERATIVA
      ↓
ANÁLISE
      ↓
IMPLEMENTAÇÃO
      ↓
TESTE
      ↓
VALIDAÇÃO
      ↓
GIT
      ↓
GITHUB
```

A IA Generativa é utilizada como **ferramenta de assistência**, enquanto análise, validação, testes e decisões técnicas continuam fazendo parte do processo de desenvolvimento.

</font>

---

<font color="#00FF41">

## 🟢 Desenvolvimento Assistido por IA

A combinação utilizada no projeto pode ser representada por:

```text
HUMAN ENGINEERING
       +
GENERATIVE AI
       +
IDE
       +
TERMINAL
       +
LINUX
       +
VERSION CONTROL
       +
TESTING
```

Essa abordagem permite utilizar Inteligência Artificial como parte do fluxo moderno de desenvolvimento sem abandonar a compreensão técnica do código.

</font>

---

<font color="#00FF41">

## 🟢 Estrutura do Projeto

```text
mcp-control-center/
│
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── paulohenrique/
│                   └── mcp_control_center/
│
├── frontend/
│
├── cobol/
│
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
├── .gitattributes
└── README.md
```

A estrutura permite a evolução progressiva das camadas Backend, Frontend e automação.

</font>

---

<font color="#00FF41">

## 🟢 Control Center

A visão de evolução do projeto é transformar o MCP Control Center em uma interface centralizada para gerenciamento de componentes técnicos.

Módulos planejados:

```text
DASHBOARD
PROFESSORES
JOBS
COBOL BATCH
ANALYTICS
LOGS
CONFIGURAÇÕES
```

Também faz parte da visão do projeto uma interface de controle inspirada em painéis operacionais, incluindo comandos e funções reais de execução.

</font>

---

<font color="#00FF41">

## 🟢 Arquitetura de Integração

```text
                 MCP CONTROL CENTER
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
      FRONTEND        BACKEND       AUTOMATION
          │              │              │
     HTML/CSS/JS    JAVA/SPRING    PYTHON/COBOL
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
                    LINUX / WSL
                         │
                         ▼
                      TERMINAL
                         │
                         ▼
                     GIT/GITHUB
                         │
                         ▼
                  GENERATIVE AI
```

</font>

---

<div align="center">

<font color="#00FF41">

## 🟢 Development Workflow

`PLAN` → `CODE` → `TEST` → `DEBUG` → `VALIDATE` → `COMMIT` → `PUSH`

</font>

</div>

<font color="#00FF41">

O processo de desenvolvimento combina programação, Terminal, Linux, Git, documentação, testes e assistência de IA Generativa.

A abordagem prioriza evolução incremental e validação das funcionalidades antes da expansão do projeto.

</font>

---

<div align="center">

<font color="#00FF41">

# 🟢 SYSTEM STATUS

| COMPONENT | STATUS |
|---|---|
| ☕ Java | 🟢 ONLINE |
| 🍃 Spring Boot | 🟢 ONLINE |
| 🟢 COBOL | 🟢 ACTIVE |
| 🐍 Python | 🟢 ACTIVE |
| ⚡ JavaScript | 🟢 ACTIVE |
| 🌐 HTML | 🟢 ACTIVE |
| 🎨 CSS | 🟢 ACTIVE |
| 🐧 Linux / WSL | 🟢 ONLINE |
| 📦 Maven | 🟢 ONLINE |
| 🔧 Git | 🟢 ONLINE |
| 🐙 GitHub | 🟢 ONLINE |
| 💻 VS Code | 🟢 ONLINE |
| 🤖 Generative AI | 🟢 ACTIVE |

</font>

</div>

---

<font color="#FF3030">

## 🔴 Development Notice

O MCP Control Center permanece em desenvolvimento contínuo.

Alguns módulos apresentados como arquitetura ou visão futura representam **roadmap do projeto** e não devem ser interpretados automaticamente como funcionalidades concluídas.

</font>

---

<div align="center">

<font color="#00FF41">

## 🟢 Developer

### PAULO HENRIQUE SANTANA MOTTA

`JAVA` • `COBOL` • `PYTHON` • `LINUX` • `CYBERSECURITY` • `AUTOMATION` • `MAINFRAME` • `GENERATIVE AI`

<br>

### MCP CONTROL CENTER

`MAINFRAME • AUTOMATION • CYBER • JAVA • COBOL • PYTHON • LINUX • AI`

<br>

`>>> SYSTEM READY_`

</font>

</div>
