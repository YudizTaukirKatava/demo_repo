#include <iostream>
#include <algorithm>
using namespace std;

int main()
{
    int target;
    int array[] = {1, 4, 6, 2, 0, 4, 9};
    int arraySize = sizeof(array) / sizeof(array[0]);
    cout << "Original array: ";
    for (int i = 0; i < arraySize; i++)
    {
        cout << array[i] << " ";
    }
    sort(array, array + arraySize);
    cout << "\nSorted array: ";
    for (int i = 0; i < arraySize; i++)
    {
        cout << array[i] << " ";

    }
    cout<<endl;
    cout<<"Enter your target variable here: ";
    cin>>target;
    for(int i=0;i<7;i++){
        if(array[i]==target){
            cout<<i<<" ";
        }
    }


    return 0;
}
