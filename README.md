# 📱 App E-commerce (Expo + React Native)

Este projeto é um aplicativo móvel desenvolvido com **React Native** e **Expo**, para a matéria de Programação Mobile da UNIFEAF, simulando um fluxo de e-commerce. O app conta com autenticação (Login), listagem de produtos por categoria (Masculino/Feminino) e visualização detalhada de itens consumindo a API **DummyJSON**.

## 🚀 Funcionalidades

- **Autenticação (Login):**
  - Validação de campos vazios.
  - Validação de credenciais (usuário/senha).
  - Feedback visual de erro (bordas vermelhas e mensagens de alerta).
  - Armazenamento de sessão com `AsyncStorage`.
- **Feed de Produtos:**
  - Consumo de API REST via **Axios**.
  - Filtragem por abas (Produtos Masculinos vs. Femininos).
  - Layout em Grid (2 colunas).
  - Tratamento de preço (Cálculo reverso de desconto para exibir "De/Por").
- **Detalhes do Produto:**
  - Navegação via `Stack Navigator`.
  - Busca dinâmica de produto por ID na API.
  - Exibição de estoque, categoria e descrição completa.

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/) (Requisições HTTP)
- [React Navigation](https://reactnavigation.org/) (Navegação entre telas)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (Persistência de dados)
- [Expo Vector Icons](https://icons.expo.fyi/)

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

## 🔐 Credenciais de Acesso

Como o backend de autenticação é simulado (Mock), utilize as seguintes credenciais para testar o login:
Usuário: admin
Senha: 123

## 📡 API Utilizada
O projeto consome dados públicos da DummyJSON.

Categorias: /products/category/{categoria}
Detalhes: /products/{id}
