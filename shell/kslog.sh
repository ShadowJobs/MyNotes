rm -rf tmp/ks
rm -rf tmp/decode
mkdir tmp/ks
adb pull sdcard/gifshow/.debug tmp/ks


x=`ls tmp/ks/.debug/liying/`
cd tmp/ks/.debug/liying/${x}
cp ../../../../../bunzip.sh ./bunzip.sh
./bunzip.sh .
cd -
pwd

 python decode_mars_nocrypt_log_file.py tmp/ks
 mkdir tmp/decode
 mv tmp/ks/.debug/liying tmp/decode
 rm -rf tmp/ks

