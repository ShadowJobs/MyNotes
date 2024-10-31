from flask import request, jsonify
from flask import Blueprint

documentRouter = Blueprint("document",__name__,url_prefix="/doc")
@documentRouter.route("/file/<path:filename>", methods=['GET', 'POST'])
def getFileContent(filename):
    print(request.method)
    print(request.view_args)
    print(request)
    if request.method == 'POST':
        return jsonify({"msg": "POST request received"})
    elif request.method == 'GET':
        with open("./documents/"+filename, "r") as f:
            data = f.read()
        return jsonify({"data":data})
    
# 获取'./documents/'目录下的所有文件名
@documentRouter.route("/file-list", methods=['GET'])
def fileList():
    import os
    files = os.listdir("./documents/")
    return jsonify({"data":files})