# Article Makefile

.PHONY: generate-pdf
generate-pdf:
	@echo "Generating PDF from article/main.md..."
	@pandoc main.md --citeproc --bibliography=references.bib -o article.pdf
	@echo "PDF generated successfully as article.pdf"
