# Article Makefile

SOURCE := article.md

HTML := $(patsubst %.md,%.html, $(SOURCE))
PDF := $(patsubst %.md,%.pdf, $(SOURCE))
DOCX := $(patsubst %.md,%.docx, $(SOURCE))
TEX := $(patsubst %.md,%.tex, $(SOURCE))

STYLE := style.css
# Source: https://gist.github.com/killercup/5917178
# Make sure you save this in the same directory as shown or change the path.

.PHONY : all
all : $(HTML) $(PDF) $(DOCX) $(TEX)

%.html : %.md $(STYLE)
	@echo --- Generating HTML ---
	@pandoc -s --css $(STYLE) --embed-resources --standalone -o $@ $<

# You will need to have the appropriate pdf-engine installed.
%.pdf : %.md
	@echo --- Generating PDF ---
	@pandoc -V papersize:a4 --pdf-engine=xelatex --citeproc --bibliography=references.bib --resource-path=.:./images -o $@ $<

%.docx : %.md
	@echo --- Generating DOCX ---
	@pandoc -o $@ $<

%.tex : %.md
	@echo --- Generating TEX ---
	@pandoc -s --citeproc --bibliography=references.bib --resource-path=.:./images -o $@ $<

.PHONY : clean
clean :
	@echo --- Deleting generated files ---
	@-rm $(HTML) $(PDF) $(DOCX) $(TEX)

.PHONY : publish
publish: $(DOCX)
	@echo "Uploading article.docx to Google Drive..."
	@chmod +x ./scripts/upload_to_drive.sh
	@./scripts/upload_to_drive.sh article.docx