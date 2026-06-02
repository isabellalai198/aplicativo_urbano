Aplicativo de Manutenção Urbana

A manutenção da infraestrutura urbana é um dos principais desafios enfrentados pelas cidades, uma vez que problemas como buracos nas vias, iluminação pública defeituosa, descarte irregular de resíduos e danos em espaços públicos afetam diretamente a qualidade de vida da população. Pensando nisso, foi desenvolvido o aplicativo de Manutenção Urbana, uma plataforma digital que busca facilitar a comunicação entre os cidadãos e os órgãos responsáveis pelos serviços públicos.

O objetivo principal do projeto é permitir que os moradores registrem ocorrências de forma rápida e prática, utilizando dispositivos móveis. Por meio do aplicativo, o usuário pode informar problemas encontrados na cidade, anexar fotografias, indicar a localização exata da ocorrência.

O projeto contribui para a modernização dos serviços públicos, incentivando a participação da população na identificação de problemas e tornando mais eficiente o planejamento das equipes de manutenção. Dessa forma, o aplicativo atua como uma ferramenta tecnológica capaz de aproximar a comunidade do poder público, colaborando para a construção de cidades mais organizadas, seguras e sustentáveis.

Para o codigo foi utilizado: React Native (Expo); React Navigation (Stack e Tab); AsyncStorage; CRUD; Interface(UI/UX).

Sobre o código: Estrutura e Funcionamento

Gerenciamento de Estado Global O coração do aplicativo é um contexto React que centraliza todos os dados. Ele carrega as ocorrências do armazenamento local do dispositivo (AsyncStorage) ao iniciar o app, e mantém a lista sempre atualizada após cada operação. Também inclui dados de exemplo para facilitar a apresentação do app no primeiro uso.

Tela Principal — Lista de Ocorrências Exibe todas as ocorrências em cards organizados. O usuário pode filtrar por categoria (Iluminação, Buraco, Dengue) e por status (Pendente, Em andamento, Resolvido) ao mesmo tempo. Um botão de atalho abre o formulário de nova ocorrência.

Cadastro de Ocorrência Formulário completo onde o cidadão informa: categoria do problema, título, descrição, endereço e prioridade (Baixa, Média ou Alta). Ao salvar, o registro é criado imediatamente e persiste no dispositivo.

Detalhe e Edição Ao tocar em uma ocorrência, o usuário vê todos os detalhes. Pode editar título, descrição, endereço e status, ou excluir o registro com confirmação. O status também pode ser alterado diretamente nessa tela sem entrar no modo de edição.

Estatísticas Painel visual com contadores e barras de progresso mostrando a distribuição das ocorrências por categoria, status e prioridade — útil para ter uma visão geral dos problemas registrados.

Persistência de Dados Todas as operações (criar, ler, atualizar e excluir) são salvas automaticamente no dispositivo via AsyncStorage, garantindo que os dados permanecem mesmo após fechar o aplicativo, sem necessidade de internet.
