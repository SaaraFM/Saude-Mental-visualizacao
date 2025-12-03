# Saúde Mental – Visualização de Dados

Aplicação web para exploração visual de dados relacionados à saúde mental, construída com **JavaScript** e empacotada com **Vite**.  
A ideia central é simples: transformar números frios em visualizações interativas que ajudem a questionar narrativas fáceis sobre saúde mental.

> Atenção: gráficos não são a realidade – são interpretações. Use este projeto para explorar e também para desconfiar dos dados.
Fonte: https://www.kaggle.com/datasets/anandpanda3/mental-health-dataset

---

## 🎯 Objetivos do Projeto

- Visualizar indicadores de saúde mental de 2018 durante os 4 primeiros meses.
- Explorar padrões, tendências e possíveis correlações nos dados, conferindo as análises em texto de cada mês logo abaixo do gráfico.
- Servir como base para experimentação em:
  - Visualização de dados
  - Front-end com Vite
  - Comunicação crítica de informações sobre saúde mental

<img width="1181" height="756" alt="image" src="https://github.com/user-attachments/assets/add48485-9830-4276-82a5-93d112a01a41" />

---

## 📂 Estrutura do Projeto

A estrutura geral do repositório é:

```bash
Saude-Mental-visualizacao/
├── public/
│   └── data/          # Arquivos de dados usados nas visualizações (CSV/JSON etc.)
├── src/               # Código-fonte da aplicação
├── index.html         # HTML base
├── package.json       # Dependências e scripts
├── vite.config.js     # Configuração do Vite
└── node_modules/      # Dependências instaladas (geradas pelo npm)
