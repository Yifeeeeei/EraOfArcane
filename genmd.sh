#!/bin/bash

# Create output directory if it doesn't exist
mkdir -p htmls

# Traverse all .md files in the mds directory
for md_file in mds/*.md; do
    # Extract the base filename (without path and extension)
    base_name=$(basename "$md_file" .md)
    
    # Build the output filename
    output_file="htmls/${base_name}.html"
    
    # Run pandoc command
    pandoc "$md_file" -o "$output_file" --standalone --toc --css=styles/gothic.css
    
    echo "Converted $md_file -> $output_file"
done