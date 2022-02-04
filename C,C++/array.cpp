// 比一个正整数大的最小回文数
#include <vector>
#include <iostream>

using namespace std;

int myPow(int x,int n){
    int result=1;
    while(n>0) {result*=n;--n;}
    return result;
}

int nextHuiwen(int x){
    int wei=1;
    int tmp=x;
    while(tmp>10){
        wei++;
        tmp/=10;
    }
    if((wei & 1)==1){//奇数位
        int mid=tmp/myPow(10,wei/2);
    }else{

    }
}

int main(){
    cout<<nextHuiwen(231); 
    //1234111  1234321  ; 1234567  1235321 ; //按中间位
    //1239322 1240421
    //  129321 129921    123322  124421     129922 130031
    return 1;
}