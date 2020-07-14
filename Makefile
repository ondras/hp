MAKEFLAGS += -r
BIN := bin
BUILD := build
DATA := data
TEMPLATE := template

DENO := $(BIN)/deno
REPOS := $(DATA)/repos.json
REPO_COMPONENTS := games demos projects
COMPONENTS := $(REPO_COMPONENTS) talks

PARTIALS := $(COMPONENTS:%=$(BUILD)/%.partial)

# resulting html
$(BUILD)/index.html: $(TEMPLATE)/index.mustache $(PARTIALS) | $(BUILD)
	$(DENO) --allow-read $(BIN)/create-index.ts $< > $@

# partial html
$(BUILD)/%.partial: $(DATA)/%.json $(TEMPLATE)/%.mustache | $(BUILD)
	cat $< | $(DENO) --allow-read $(BIN)/create-partial.ts $(TEMPLATE)/$*.mustache > $@

# data sources
$(DATA)/talks.json:
	# no-op, handcrafted

$(DATA)/%.json: $(REPOS)
	cat $< | $(DENO) $(BIN)/split-repos.ts $* > $@

$(REPOS):
	env $(shell cat secrets.env | xargs) $(DENO) --allow-net --allow-env $(BIN)/fetch-repos.ts > $@

# misc
$(BUILD):
	mkdir -p $@

clean:
	rm -rf $(BUILD) $(REPOS) $(REPO_COMPONENTS:%=$(DATA)/%.json)

.PHONY: clean

.DELETE_ON_ERROR:
