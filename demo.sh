#!/bin/bash

# Clone or update the repository
git clone -b master https://github.com/YudizTaukirKatava/demo_repo.git /home/ubuntu/clean_dir

# Compare with another directory (assuming it already exists)
cd /home/ubuntu

# Remove directories that exist on the remote server but are absent in the repository
for dir in /home/ubuntu/*; do
    if [[ -d "$dir" && ! -d "/home/ubuntu/clean_dir/$(basename "$dir")" ]]; then
        # Directory exists on the remote server but is absent in the repository, delete it
        rm -rf "$dir"
    fi
done

# Compare files and delete files that are not the same (excluding the 'build' directory)
for file in /home/ubuntu/*; do
    if [[ ! -f "$file" || ! -z $(diff -q "$file" "/home/ubuntu/clean_dir/$(basename "$file")" | grep -v "build/") ]]; then
        # File doesn't exist or is different, delete it
        if [[ "${file##*.}" == "txt" || "${file##*.}" == "md" ]]; then
            rm -rf "$file"
        fi
    fi
done



# Remove the 'clean_dir' directory
rm -rf /home/ubuntu/clean_dir








