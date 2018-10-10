#判断一个点的颜色，第五课
import random
class MyClassifier():
    def fit(self,x,y):
        self.x=x
        self.y=y
    def predict(self,x):
        pres=[]
        for row in x:
            r=random.choice(self.y)
            pres.append(r)
        return pres


from sklearn import datasets
iris=datasets.load_iris()

x=iris.data
y=iris.target

from sklearn.cross_validation import train_test_split
xtrain,xtest,ytrain,ytest=train_test_split(x,y,test_size=.5)

#自己的分类器
myClassifier=MyClassifier()
#

myClassifier.fit(xtrain,ytrain)
predictions=myClassifier.predict(xtest)
from sklearn.metrics import accuracy_score
print accuracy_score(ytest,predictions)