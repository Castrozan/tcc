# Artigo: Agentes Conversacionais com IA para Interação Aprimorada em Sistemas

Este diretório contém todos os recursos relacionados ao artigo do Trabalho de Conclusão de Curso (TCC) sobre Agentes Conversacionais com IA para Interação Aprimorada em Sistemas.

## 📑 Conteúdo do Diretório

- `article.md` - Texto do artigo em formato Markdown
- `article.tex` - Versão LaTeX do artigo
- `article.docx` - Versão Word do artigo
- `article.pdf` - Versão final do artigo em PDF
- `article.html` - Versão HTML do artigo
- `references.bib` - Referências bibliográficas em formato BibTeX
- `Makefile` - Scripts para compilação do artigo em diversos formatos
- `style.css` - Estilos para a versão HTML
- `pandoc-docs.md` - Documentação sobre o uso do Pandoc para conversão de formatos

### Diretórios
- `images/` - Imagens e figuras utilizadas no artigo
- `example/` - Exemplos de código e implementações mencionadas no artigo

## 🔧 Como Compilar o Artigo

O artigo pode ser compilado em diferentes formatos utilizando o Makefile fornecido:

```bash
# Compilar todos os formatos
make all

# Compilar apenas PDF
make pdf

# Compilar apenas DOCX
make docx

# Compilar apenas HTML
make html

# Limpar arquivos gerados
make clean
```

## 📝 Estrutura do Artigo

O artigo segue a estrutura acadêmica tradicional:

1. **Resumo** - Síntese do trabalho
2. **Introdução** - Contextualização, objetivos e justificativa
3. **Procedimento Experimental**
   - Materiais
   - Métodos
4. **Resultados e Discussões**
5. **Considerações Finais**
6. **Referências**

## 🔍 Abstract

> Este trabalho apresenta o desenvolvimento de um agente conversacional baseado em inteligência artificial para aprimorar a interação entre usuários e sistemas. Utilizando técnicas avançadas de processamento de linguagem natural, o agente proposto visa simplificar a comunicação em interfaces complexas, proporcionando uma experiência digital unificada e adaptável às necessidades dos usuários.

## 👤 Autor

**Lucas de Castro Zanoni**
- GitHub: [@Castrozan](https://github.com/Castrozan)

## 🧩 Relação com o Projeto Principal

Este artigo documenta a pesquisa e implementação relacionadas ao MCP Server Manager e os servidores MCP de exemplo que estão implementados na raiz do projeto. Para mais informações sobre a implementação, consulte o [README principal](../README.md) do projeto.


## Recomendações de uso

- Utilize o alias ```alias pandock='docker run --rm -v "$(pwd):/data" -u $(id -u):$(id -g) pandoc/extra'``` para compilar o artigo.
- Utilize o template ```template.tex``` para compilar o artigo.
- Utilize a sintaxe de tabelas do Markdown para formatar as tabelas.

### 📊 Formatação de Tabelas

Todas as tabelas no artigo agora utilizam a sintaxe de tabelas do Markdown, o que oferece várias vantagens:

1. **Melhor legibilidade** - As tabelas em Markdown são mais fáceis de ler no código-fonte
2. **Edição simplificada** - Não é necessário lidar com tags HTML complexas
3. **Consistência** - Formato uniforme para todas as tabelas
4. **Compatibilidade** - O Pandoc converte automaticamente tabelas Markdown para os formatos de saída (HTML, PDF, DOCX, etc.)

Exemplo de sintaxe de tabela Markdown:

```markdown
| Cabeçalho 1 | Cabeçalho 2 |
|-------------|-------------|
| Célula 1    | Célula 2    |
| Célula 3    | Célula 4    |
```
