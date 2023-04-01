#!/bin/sh

# usage: ./gmake.sh [makefile_target] | dot -Tpng > Makefile.png

echo "digraph G {"
make -Bnp $* \
	| grep ": " \
	| grep -v "\(.PHONY\|.SHELLSTATUS\|[#%]\)" \
	| sed -e "s/ *|.*//" \
	| awk '{split($$0,a ,"[: ]+"); for(i=2;i<=length(a);i++) print "\""a[i]"\"->\""a[1]"\""}'
echo "}"
