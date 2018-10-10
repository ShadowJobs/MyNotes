
import jieba
import chardet


seg_list = jieba.cut("我来到北京清华大学".decode('utf-8').encode('gbk') ,cut_all=True)
print seg_list
print("Full Mode: " + " /".join(seg_list))  # 全模式



seg_list = jieba.cut("我来到北京清华大学", cut_all=False)
print("Default Mode: " + "/ ".join(seg_list))  # 精确模式

seg_list = jieba.cut(u"他来到了网易杭研大厦")  # 默认是精确模式
print(", ".join(seg_list))

seg_list = jieba.cut_for_search(u"小明硕士毕业于中国科学院计算所，后在日本京都大学深造")  # 搜索引擎模式
print(", ".join(seg_list))
