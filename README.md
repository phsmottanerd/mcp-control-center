
# MCP Control Center

**MCP Control Center** é uma plataforma experimental de **controle, automação e integração de tecnologias de software**, construída com uma arquitetura inspirada em ambientes corporativos de **Mainframe, operações de TI, automação de processos e sistemas distribuídos**.

O projeto nasceu com uma ideia central: **unir tecnologias tradicionais de missão crítica com ferramentas modernas de desenvolvimento e Inteligência Artificial Generativa**, criando um ambiente único para organizar, monitorar e executar diferentes componentes de uma operação tecnológica.

```text
                         ┌─────────────────────────────┐
                         │      MCP CONTROL CENTER     │
                         │   MAINFRAME OPERATIONS      │
                         └──────────────┬──────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
              ▼                         ▼                         ▼
       ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
       │    COBOL    │          │    JAVA     │          │   PYTHON    │
       │    BATCH    │          │ SPRING BOOT │          │ AUTOMATION  │
       └──────┬──────┘          └──────┬──────┘          └──────┬──────┘
              │                        │                         │
              └────────────────────────┼─────────────────────────┘
                                       ▼
                            ┌─────────────────────┐
                            │   CONTROL CENTER    │
                            │   PROCESSING LAYER  │
                            └──────────┬──────────┘
                                       │
                  ┌────────────────────┼────────────────────┐
                  ▼                    ▼                    ▼
             ┌─────────┐        ┌────────────┐       ┌────────────┐
             │ LINUX   │        │ ANALYTICS  │       │    LOGS    │
             │   WSL   │        │ & METRICS  │       │ MONITORING │
             └─────────┘        └────────────┘       └────────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │ GENERATIVE AI    │
                              │ INTELLIGENCE     │
                              └──────────────────┘
```

## 🟢 Uma ponte entre Mainframe e tecnologia moderna

O MCP Control Center foi pensado para representar uma arquitetura onde tecnologias com décadas de presença no mercado podem coexistir com ferramentas modernas.

No núcleo conceitual estão **COBOL e Mainframe**, representando processamento corporativo e workloads tradicionais, enquanto **Java/Spring Boot, Python, Linux/WSL e JavaScript** fornecem uma camada moderna para desenvolvimento, automação, integração e controle.

A **IA Generativa** entra como uma camada adicional de inteligência, permitindo explorar novas formas de interação com sistemas, automação, análise de informações e apoio às operações.

---

## 🖥️ Arquitetura orientada a Control Center

O conceito do projeto é semelhante a um **centro de operações tecnológico**.

Em vez de tratar cada tecnologia como um projeto isolado, o MCP Control Center busca criar uma visão integrada:

**Entrada → Processamento → Automação → Execução → Monitoramento → Analytics → Inteligência**

Essa abordagem permite organizar diferentes componentes dentro de uma arquitetura única e evolutiva.

---

## ⚙️ Tecnologias

### ☕ Java / Spring Boot

O backend utiliza **Java** e **Spring Boot** como base para construção da aplicação, organização da arquitetura e criação dos serviços da plataforma.

A estrutura foi pensada para permitir evolução gradual do sistema, adicionando novos módulos e endpoints conforme o projeto cresce.

### 🟢 COBOL / Mainframe

COBOL representa o núcleo **Mainframe/Bach Processing** da arquitetura.

A presença do COBOL não é apenas estética: o projeto foi concebido para aproximar conceitos de processamento batch e sistemas corporativos tradicionais de uma camada moderna de controle e automação.

### 🐍 Python

Python atua como uma tecnologia de **automação e processamento**, permitindo construir rotinas auxiliares, automações e integrações.

### 🐧 Linux / WSL

O ambiente Linux/WSL funciona como laboratório de desenvolvimento e execução, aproximando o projeto de ambientes reais utilizados em infraestrutura, servidores, automação e sistemas corporativos.

### 🌐 JavaScript / HTML / CSS

A camada frontend utiliza tecnologias web para construir a interface visual do Control Center.

O objetivo é transformar operações técnicas em uma experiência visual semelhante a um **painel operacional**, com módulos, indicadores, controles e informações organizadas.

### 🤖 Generative AI

A **IA Generativa** é um dos pilares conceituais do projeto.

A proposta é explorar como modelos de IA podem trabalhar junto de ferramentas tradicionais de desenvolvimento e operações, auxiliando em tarefas como:

- interpretação de informações;
- automação;
- análise de dados;
- geração de conteúdo técnico;
- suporte à operação;
- interação com sistemas;
- evolução de workflows.

A ideia não é substituir os componentes tradicionais, mas criar uma camada de **inteligência sobre a infraestrutura existente**.

---

## 🏗️ Visão de arquitetura

O MCP Control Center segue uma filosofia modular.

```text
                  ┌─────────────────────────┐
                  │     USER / OPERATOR     │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │    CONTROL CENTER UI    │
                  │     WEB INTERFACE      │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │     JAVA / SPRING       │
                  │      APPLICATION        │
                  └────────────┬────────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
        ┌─────────┐       ┌──────────┐      ┌──────────┐
        │  COBOL  │       │  PYTHON  │      │  LINUX   │
        │  BATCH  │       │AUTOMATION│      │   WSL    │
        └────┬────┘       └─────┬────┘      └────┬─────┘
             │                  │                 │
             └──────────────────┼─────────────────┘
                                ▼
                     ┌────────────────────┐
                     │ ANALYTICS / LOGS   │
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌────────────────────┐
                     │   GENERATIVE AI    │
                     │ INTELLIGENCE LAYER │
                     └────────────────────┘
```

---

## 🎛️ Control Center

A interface foi concebida com inspiração em **centrais de operação Mainframe**, terminais corporativos e dashboards modernos.

A visão de evolução do projeto contempla módulos como:

- **Dashboard**
- **Professores**
- **Jobs**
- **COBOL Batch**
- **Analytics**
- **Logs**
- **Configurações**

Além disso, existe a proposta de incorporar uma experiência de operação inspirada em **teclados de controle F1–F12**, comandos operacionais e execução de Jobs.

Esses elementos fazem parte da evolução planejada da plataforma e serão implementados progressivamente.

---

## 🔐 Cybersecurity

A arquitetura visual e conceitual também incorpora princípios de **Cybersecurity**, principalmente pela preocupação com:

- logs;
- rastreabilidade;
- controle de execução;
- automação;
- monitoramento;
- análise de eventos;
- organização de operações.

O objetivo é evoluir o projeto para que segurança e observabilidade façam parte da arquitetura, e não sejam adicionadas somente posteriormente.

---

## 📊 Analytics e Observabilidade

Uma plataforma de controle precisa responder rapidamente:

**O que está acontecendo?**

**Qual processo está executando?**

**Qual Job terminou?**

**Existe algum erro?**

**Qual componente gerou o evento?**

**Qual foi o resultado da execução?**

Por isso, Analytics e Logs fazem parte da arquitetura planejada do MCP Control Center.

A intenção é transformar informações técnicas em **dados operacionais compreensíveis**, permitindo uma visão mais próxima de um verdadeiro centro de operações.

---

## 🚀 Filosofia do projeto

O MCP Control Center não foi criado simplesmente para demonstrar uma única linguagem.

A proposta é demonstrar **integração de conhecimentos**.

```text
MAINFRAME
    +
COBOL
    +
JAVA
    +
PYTHON
    +
LINUX
    +
AUTOMATION
    +
CYBERSECURITY
    +
GENERATIVE AI
    =
MCP CONTROL CENTER
```

É justamente essa combinação que define a identidade do projeto.

O objetivo é construir uma plataforma onde conceitos de **Mainframe e sistemas corporativos tradicionais** possam conversar com **desenvolvimento moderno, automação, Linux, observabilidade e Inteligência Artificial**.

---

## 🟢 SYSTEM STATUS

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│              MCP CONTROL CENTER                      │
│                                                      │
│  MAINFRAME        [ ONLINE ]                         │
│  AUTOMATION       [ ONLINE ]                         │
│  JAVA             [ ONLINE ]                         │
│  COBOL            [ ONLINE ]                         │
│  PYTHON           [ ONLINE ]                         │
│  LINUX / WSL      [ ONLINE ]                         │
│  GENERATIVE AI    [ ACTIVE ]                         │
│                                                      │
│              SYSTEM STATUS: ONLINE                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**MCP Control Center — conectando Mainframe, Automação, Desenvolvimento, Cybersecurity e Inteligência Artificial em uma única visão operacional.**

<img width="1295" height="579" alt="02" src="https://github.com/user-attachments/assets/5c07b919-7465-48ab-9f65-701c22889ea2" />
<img width="1369" height="637" alt="04" src="https://github.com/user-attachments/assets/ded89d2d-4d14-46b3-966e-fb7d550ba9c0" />
<img width="1288" height="600" alt="022" src="https://github.com/user-attachments/assets/41253b59-29b9-4f30-858d-39c6e222ab3f" />
<img width="1246" height="637" alt="-120" src="https://github.com/user-attachments/assets/fc61067d-6249-4806-9f57-9693951bdc1e" />
<img width="1284" height="589" alt="012" src="https://github.com/user-attachments/assets/2910f000-b8e1-4c10-a682-ee6c22584499" />
<img width="1289" height="646" alt="010" src="https://github.com/user-attachments/assets/18e580a7-1a07-4cde-a9d0-b28ed8843bf2" />
<img width="1337" height="601" alt="08" src="https://github.com/user-attachments/assets/3172fb67-4dd7-476d-a46c-8ed8f69782f9" />







