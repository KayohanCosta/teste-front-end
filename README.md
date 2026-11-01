# Econverse | Teste Front-end

Desenvolvi esta aplicação a partir do desafio técnico da Econverse, utilizando **React, TypeScript e Sass**, sem bibliotecas de interface. O projeto reproduz a composição proposta no Figma e integra as vitrines ao catálogo disponibilizado para o teste.

Nas decisões de implementação, priorizei clareza, reaproveitamento de componentes e facilidade de manutenção. Além dos requisitos principais, trabalhei a adaptação para dispositivos móveis, a navegação por teclado e o tratamento dos estados de carregamento, erro e ausência de resultados.

**Referências:** [desafio](https://github.com/EconverseAG/teste-front-end) · [layout](https://www.figma.com/design/rWnzPeoxgynuNPsJjV0VmV/Teste-Front-End-Jr?node-id=0-1) · [catálogo](https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json)

## Executando o projeto

**Pré-requisitos:** Node.js 22.12 ou superior e npm.

```sh
npm ci
npm run dev
```

A aplicação fica disponível no endereço informado pelo Vite, normalmente `http://127.0.0.1:5173`.

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento. |
| `npm test` | Executa os testes com Vitest e Testing Library. |
| `npm run build` | Verifica os tipos com TypeScript e gera o build em `dist/`. |
| `npm start` | Serve o build e a rota do catálogo em `http://127.0.0.1:4173`. |
| `npm run preview` | Disponibiliza uma prévia estática do build. |

Para executar a versão de produção localmente:

```sh
npm run build
npm start
```

## Funcionalidades

- Vitrines alimentadas pelo JSON oficial, com navegação horizontal e busca por nome.
- Modal com imagem, nome, descrição e preço do produto selecionado, além do controle de quantidade.
- Sacola demonstrativa com persistência local, remoção de itens e cálculo do total.
- Layout responsivo para desktop e dispositivos móveis.
- Estados de carregamento, falha na consulta e lista vazia.
- Newsletter com validação dos campos e consentimento.

## Decisões técnicas

### Componentes e estado

Separei cabeçalho, rodapé, vitrine e modal em componentes com responsabilidades definidas. A vitrine é reutilizada nas três seções de produtos, mantendo o comportamento consistente e evitando duplicação de marcação.

O estado compartilhado fica no `App`, enquanto estados específicos, como quantidade e expansão dos detalhes, permanecem no componente que os utiliza. Para o escopo da página, os recursos nativos do React atendem à comunicação entre componentes sem exigir uma biblioteca adicional de gerenciamento de estado.

### Integração com o catálogo

Centralizei os tipos, a consulta e a validação dos produtos em `src/services/products.ts`. A resposta é validada em tempo de execução antes de chegar à interface, incluindo os campos obrigatórios e o valor do preço. Mantive os valores numéricos do catálogo como reais e utilizei `Intl.NumberFormat` para a apresentação monetária.

O servidor fornecido não retorna o cabeçalho `Access-Control-Allow-Origin`. Para permitir a consulta pelo navegador, utilizei a rota de mesma origem `/api/produtos`: o Vite faz o encaminhamento em desenvolvimento, e `server.mjs` realiza a mesma função na versão compilada, usando as APIs nativas do Node.js e um destino fixo.

A consulta possui limite de tempo e suporte a cancelamento. Se o serviço ficar indisponível, a aplicação utiliza a cópia do catálogo em `public/produtos.json`, informa essa condição e oferece uma nova tentativa. Dessa forma, uma falha da integração não impede a navegação pela vitrine.

> Para publicar com atualização do catálogo, é necessário executar o servidor Node ou configurar uma rota equivalente na hospedagem. Em uma hospedagem exclusivamente estática, a página utiliza a cópia local dos produtos.

### Interface e acessibilidade

Utilizei os assets originais do Figma e mantive as fontes junto da aplicação. Os estilos estão em Sass, com variáveis para as cores principais e regras responsivas.

O modal utiliza o elemento nativo `dialog`, com identificação acessível, fechamento por Escape e clique fora, bloqueio da rolagem de fundo e retorno do foco ao elemento que o abriu. Também incluí foco visível, textos alternativos nas imagens, regiões de status e respeito à preferência por movimento reduzido.

A página utiliza HTML semântico, hierarquia de títulos e metadados de título e descrição. Os dados ilustrativos dos cards foram substituídos pelas informações reais do catálogo, sem criar preços anteriores ou descontos que a fonte não fornece.

## Organização

```text
src/
├── components/      Cabeçalho, rodapé, vitrine e modal
├── services/        Tipos, validação e consulta dos produtos
├── test/            Configuração do ambiente de testes
├── App.tsx          Composição da página e estado compartilhado
├── main.tsx         Inicialização da aplicação e fontes
└── styles.scss      Estilos, variáveis e regras responsivas
public/
├── assets/          Imagens e SVGs do layout
└── produtos.json    Catálogo de contingência
server.mjs           Servidor do build e encaminhamento da consulta
```

Os testes dos componentes e do serviço ficam próximos dos respectivos arquivos de implementação.

## Testes e validação

Configurei também um workflow do GitHub Actions para executar os testes e a compilação a cada push ou pull request.

Os sete testes automatizados cobrem:

- Preservação e formatação dos preços do catálogo.
- Rejeição de produtos incompletos ou inválidos.
- Consulta ao endereço oficial, recuperação com o catálogo local e cancelamento de requisições.
- Exibição do produto selecionado e compra demonstrativa com a quantidade escolhida.
- Fechamento do modal e restauração do foco.

Também foram verificados no navegador o carregamento dos dez produtos, a busca, o fechamento por Escape e a inclusão de itens na sacola com o total correspondente. O layout foi conferido em larguras de 1440px e 390px. A correção mais recente do espaço para as sombras dos cards passou pela compilação e ainda precisa de uma nova conferência visual.

## Escopo da demonstração

A sacola não realiza checkout ou pagamento. A newsletter valida os campos na interface, mas não envia nem armazena informações de contato. Os serviços de conta, pedidos e demais páginas institucionais não possuem integração; os controles correspondentes informam essa condição.

Como o JSON disponibiliza apenas celulares, as demais categorias apresentam um estado vazio. As diferenças entre os textos reais do catálogo e os exemplos do Figma também alteram algumas quebras de linha nos cards.

