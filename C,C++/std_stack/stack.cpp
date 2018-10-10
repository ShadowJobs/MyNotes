#include <stack>
#include <iostream>
using namespace std;

int main()
{
    stack<string> st;
    st.push("aa");
    st.push("bb");
st.push(st.top());
    cout<<st.top()<<endl;
    auto x=st.top();
    x=x+"bb";
    cout<<st.top()<<endl;
    st.pop();
    st.pop();
    cout<<st.top()<<endl;


return 1;
}
