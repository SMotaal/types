echo "PACKAGE: $(pwd)";
tsc $@ --listFiles | grep -v "^[\/:].*[\/:]node_modules[\/:]typescript[\/:]lib[\/:].*[.]d[.]ts$"
