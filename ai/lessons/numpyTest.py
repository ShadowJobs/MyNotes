import numpy as np
def dataSet():
    data=np.array([[1,101],[5,89],[108,5],[115,8]])
    data=data*1.0
    labels=np.array(['a','d'])
    return data,labels

data,labels=dataSet();
def guiyi(testData):
    for i in range(data.shape[len(data.shape)-1]):
        minv=np.amin(testData,axis=0)[i]
        cha=np.amax(testData,axis=0)[i]-minv
        if cha==0:
            testData=testData-testData
        else:
            testData[:,i]=(testData[:,i]-minv)/cha
    return testData

def getDis(testData,dot):
    pass

testData=guiyi(data.copy())
print testData

