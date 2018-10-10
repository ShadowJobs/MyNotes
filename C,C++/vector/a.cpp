#include <iostream>
#include <vector>
using namespace std;
int main()
{
    vector<string> v1; 
    v1.push_back("aa");
    v1.push_back("aa");
    //v1.push_front("bb");
    for(int i=0;i<v1.size();i++)
        cout<<v1[i]<<endl;

        return 1;
}
