MAKEFLAGS += -r
PROJECTS := texty slides just-spaceships 7drl-2019 wild-west derivative-captcha oz.php qr wwwsqldesigner jsslides
PARTIALS := games utils old projects slides texty

REPOS := .repos
BUILD := .build
HTML := root/index.html

help:
	@echo "usage: make html|repos|image|push"

repos: $(PROJECTS)

image: $(HTML)
	docker buildx build . --platform=linux/amd64,linux/arm64 -t ondras/ondras.zarovi.cz:latest

push: $(HTML)
	docker buildx build . --platform=linux/amd64,linux/arm64 -t ondras/ondras.zarovi.cz:latest --push

html: $(HTML)

# main index html from partial html fragments
$(HTML): template/index.mustache $(PARTIALS:%=$(BUILD)/%.partial)
	deno run --allow-read bin/create-index.ts $< > $@

# html fragments from per-repo json listings
$(BUILD)/slides.partial $(BUILD)/texty.partial: $(BUILD)/%.partial: $(REPOS)/%/public.json template/%.mustache | $(BUILD)
	cat $(REPOS)/$*/public.json | deno run --allow-read bin/create-partial.ts template/$*.mustache > $@

# other html fragment from github repo listings
$(BUILD)/%.partial: $(BUILD)/%.json template/%.mustache
	cat $< | deno run --allow-read bin/create-partial.ts template/$*.mustache > $@

# individual repo listings
$(BUILD)/%.json: $(REPOS)/all.json | $(BUILD)
	cat $< | deno run bin/split-repos.ts $* > $@

# big json with all repository data
$(REPOS)/all.json: | $(REPOS)
	env $(shell cat secrets.env | xargs) deno run --allow-net --allow-env bin/fetch-repos.ts > $@

# repositories
$(PROJECTS):
	if [ -d $(REPOS)/$@/.git ]; then \
        cd $(REPOS)/$@ ; \
		git pull ; \
    else \
        git clone git@github.com:ondras/$@.git $(REPOS)/$@ ; \
    fi

# misc
$(BUILD) $(REPOS):
	mkdir -p $@

clean:
	rm -rf $(BUILD) $(REPOS) $(HTML)

.PHONY: image $(PROJECTS)
