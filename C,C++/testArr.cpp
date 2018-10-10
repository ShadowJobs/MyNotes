#include <iostream>

using namespace std;
int main()
{
    int line=1;
    int arr[5]={1,2};
    arr[4]=99;
   cout<<"arr size:"<<sizeof arr<<"\n"<<"arr element size:"<<sizeof arr[0]
    <<" arr length:"<<sizeof arr/sizeof arr[0]<<endl;
    for(int i=0;i<5;i++)
    {
        cout<<arr[i]<<endl;
    }
}
