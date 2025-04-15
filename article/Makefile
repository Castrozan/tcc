# Article Makefile
# reference: https://gist.github.com/killercup/5917178

SOURCE := article.md

HTML := $(patsubst %.md,%.html, $(SOURCE))
PDF := $(patsubst %.md,%.pdf, $(SOURCE))
DOCX := $(patsubst %.md,%.docx, $(SOURCE))
TEX := $(patsubst %.md,%.tex, $(SOURCE))

STYLE := style/style.css

.PHONY : all
all : $(HTML) $(PDF) $(DOCX) $(TEX)

%.html : %.md $(STYLE)
	@echo --- Generating HTML ---
	@pandoc -s --css $(STYLE) --embed-resources --standalone -o $@ $<

%.pdf : %.md
	@echo --- Generating PDF ---
	@pandoc -V papersize:a4 --pdf-engine=xelatex --citeproc --csl=style/abnt.csl --bibliography=references.bib --resource-path=.:./images -o $@ $<

# TODO: Add update the template.docx with actual satc template
# https://chatgpt.com/share/67fda703-8228-800e-8110-cd975901eb7b
%.docx : %.md
	@echo --- Generating DOCX ---
	@pandoc --citeproc --csl=style/abnt.csl --bibliography=references.bib --reference-doc=style/template.docx -o $@ $<

%.tex : %.md
	@echo --- Generating TEX ---
	@pandoc -s --citeproc --csl=style/abnt.csl --bibliography=references.bib --resource-path=.:./images -o $@ $<

.PHONY : clean
clean :
	@echo --- Deleting generated files ---
	@-rm $(HTML) $(PDF) $(DOCX) $(TEX)

.PHONY : publish
publish: $(DOCX)
	@echo "Uploading docx and pdf to Google Drive..."
	@chmod +x ./scripts/upload_to_drive.sh
	@./scripts/upload_to_drive.sh article.docx
	@./scripts/upload_to_drive.sh article.pdf