#include <iostream>
using namespace std;

int main(){
   int n,target;
   cout<<"How many elements you wants to add in array ?"<<endl;
   cin>>n;
   int a[n] = {};
   for(int i=0;i<n;i++){
    cin>>a[i];
   }
   cout<<"array elements are: ";
   for(int i=0;i<n;i++){
    cout<<a[i]<<"  ";
   }
   cout<<endl;
   cout<<"Enter Target value here: "<<endl;
   cin>>target;
   for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            if(a[i]+a[j]==target){
                cout<<a[i]<<' '<<a[j]<<endl;
            }
        }
   }
}