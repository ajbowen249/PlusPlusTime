# Password Cracking
This week, we were given a set of md5 hashes (along with a helper header file for md5 hashing) and were asked to try to determine the password they correspond to. main.cpp is my basic wrapper around the helper to process console input. test.sh is left it the final state it had as I was working through the list (in this case, searching for "wordsha"). Original challenge text:

*PASSWORD CRACKING CHALLENGE*

What follows is a list of md5 hashes. Each one has been generated from a plaintext password. Your challenge is this: for each hash, identify the password to which it corresponds.

The tags to the left give a name to each hash as well as implying some hints.

The order of the hashes is very roughly in order of difficulty.

I have also distributed a simple and small, one-file C++ language md5 implementation as "md5.h". Use it like this:

    MD5 md5;
    char* hashString = md5.digestString( "proposed password" );

Other languages (Python, JavaScript, etc.) may have more convenient md5 functionality built in or readily integrated.

trivial:        5f4dcc3b5aa765d61d8327deb882cf99

word:           ad731488b5c222c0d97c1a15e26d45ed

lowercase4:     728253e548c0ce53e72e63320578b098

dword10:        5034ae846e3047a6fb433aeac061c826

wordsha:        7aaaa4563da62da0ec704299ffaf2e78

memorable:      e9f5bd2bae1c70770ff8c6e6cf2d7b76

hard:           a029a1fae39c578741fc058e315cc3fd

extreme:        c818e3deb066e06e7c094d89cecb4a05

impossible:     3d8f036425f3ab824cb5c9fa119fdd89
