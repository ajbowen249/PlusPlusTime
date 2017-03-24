for i in `cat /usr/share/dict/words`
do
    hashed=`./a.out $i`
#    echo $hashed
#    echo $i
    hash=`./a.out $hashed`
    if [ "$hash" = "7aaaa4563da62da0ec704299ffaf2e78" ]; then
        echo $i
    fi
done

