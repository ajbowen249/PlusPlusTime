#include "md5.h"
#include <iostream>
int main(int argc, char** argv) {
    MD5 md5;
    char* hashString = md5.digestString(argv[1]);
    std::cout << hashString << "\n";
    return 0;
}