a0=[1,2,4]
size=len(a0)
def swap(arr,i,j):
    if i!=j:
        tmp=arr[i]
        arr[i]=arr[j]
        arr[j]=tmp
result=[]
def sort(arr,start):
    if size-1==start:
        ta=[]
        for i in range(size):
            ta.append(arr[i])
        result.append(ta)
        print ta
    else:
        for i in range(start,size):
            if i==start:
                sort(arr,start+1)
            elif arr[i]==arr[start]:
                continue
            else:
                swap(arr,start,i)
                sort(arr,start+1)
                swap(arr,i,start)

sort(a0,0)
print len(result)