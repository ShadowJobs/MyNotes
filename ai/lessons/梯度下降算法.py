#y=4x^2-2x+3/4的最小值，梯度下降法
#y'=8x-2
#x=x-λ·y'
def f0(x):
    return 4.0*(x**2)-2.0*x+3.0/4
def f1(x):
    return 8.0*x-2
buchang=0.1

x=5.0
result=f0(x)
count=0
while True:
    x=x-buchang*f1(x)
    newv=f0(x)
    if newv<result:
        count+=1
        result=newv
    else:
        break
print result,x,count