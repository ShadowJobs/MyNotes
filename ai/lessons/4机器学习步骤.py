from sklearn import datasets
iris=datasets.load_iris()

x=iris.data
y=iris.target

from sklearn.cross_validation import train_test_split
xtrain,xtest,ytrain,ytest=train_test_split(x,y,test_size=.5)

#方法1
# from sklearn import tree
# myClassifier=tree.DecisionTreeClassifier()
#

#方法2
from sklearn.neighbors import KNeighborsClassifier
myClassifier=KNeighborsClassifier()
#

myClassifier.fit(xtrain,ytrain)
predictions=myClassifier.predict(xtest)
from sklearn.metrics import accuracy_score
print accuracy_score(ytest,predictions)