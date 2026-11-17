#!/bin/sh
# Run from any directory; source Markdown and the Pandoc template are in this repo.
set -eu
cd "$(dirname "$0")"
python3 tools/build-pages.py
