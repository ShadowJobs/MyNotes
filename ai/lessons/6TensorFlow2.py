import numpy as np
import matplotlib.pyplot as plt 
# %matplotlib inline
import tensorflow as tf 
learn = tf.contrib.learn
tf.logging.set_verbosity(tf.logging.ERROR)

mnist=learn.datasets.load_dataset('mnist')
data=mnist.train.images
lables=np.asarray(mnist.train.labels,dtype=np.int32)
test_data=mnist.test.images 
test_lables=np.asarray(mnist.test.labels,dtype=np.int32)

max_examples=1000
data=data[:max_examples]
lables=lables[:max_examples]

def display(i):
    img=test_data[i]
    plt.title('examle %d. Lable:%d' %(i,test_lables[i]))
    plt.imshow(img.reshape(28,28),cmap=plt.cm.gray_r)
display(0)
display(1)