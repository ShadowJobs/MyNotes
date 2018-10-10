import numpy as np
import matplotlib.pyplot as plt
greyhounds=500
labs=500
grey_h=28+4*np.random.randn(greyhounds)
lab_h=24+4*np.random.randn(labs)
plt.hist([grey_h,lab_h],stacked=True,color=['r','b'],align='mid')
plt.show()