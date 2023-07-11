git clone -b master https://github.com/YudizTaukirKatava/demo_repo.git /home/ubuntu/clean_dir
cd /home/ubuntu
for dir in /home/ubuntu/*; do
    if [[ -d "$dir" && ! -d "/home/ubuntu/clean_dir/$(basename "$dir")" ]]; then
        rm -rf "$dir"
    fi
done

for file in /home/ubuntu/*; do
    if [[ ! -f "$file" || ! -z $(diff -q "$file" "/home/ubuntu/clean_dir/$(basename "$file")" | grep -v "build/") ]]; t>       
        rm -rf "$file"
    fi
done
rm -rf /home/ubuntu/clean_dir