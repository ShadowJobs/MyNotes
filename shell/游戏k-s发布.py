# coding: utf-8
import os
import json
import random
import re
import requests
import sys

reload(sys)
sys.setdefaultencoding("utf-8")

root_path = os.path.abspath(".")
tmp_path = os.path.join(root_path, "tmp")
out_path = os.path.join(root_path, "out")

def encrypt(input_file, output_file, verbose=False, key=None):
    with open(input_file, "rb") as file:
        data = file.read()
    out = bytearray()
    out.extend("gcdb".encode("utf-8"))
    keyByte = bytearray()
    if not key:
        keyLen = random.randint(4, 20)
        out.append(keyLen)
        for i in range(keyLen):
            k = random.randint(1, 127)
            keyByte.append(k)
            out.append(k)
    else:
        keyLen = len(key)
        out.append(keyLen)
        for i in range(keyLen):
            k = key[i]
            keyByte.append(k)
            out.append(k)

    for i in range(len(data)):
        inC = data[i]
        k = keyByte[i % keyLen]
        outC = chr(ord(inC) ^ k)
        out.append(outC)
    with open(output_file, "wb") as file:
        file.write(out)
    if verbose:
        print("加密成功: %s" % output_file)


def decrypt(input_file, output_file, verbose=False):
    with open(input_file, "rb") as file:
        data = file.read()
    keyLen = ord(data[0])
    outLen = len(data) - 1 - keyLen
    out = bytearray()
    for i in range(outLen):
        inC = data[1 + i + keyLen]
        key = data[1 + i % keyLen]
        outC = chr(ord(inC) ^ ord(key))
        out.append(outC)
    with open(output_file, "wb") as file:
        file.write(out)
    if verbose:
        print("解密成功: %s" % output_file)


def dfs(src_root, sub_dir, dst_root, key_sufix=""):
    src_folder = os.path.join(src_root, sub_dir)
    if not os.path.isdir(src_folder):
        return

    for file_name in os.listdir(src_folder):
        src_file = os.path.join(src_folder, file_name)
        if os.path.isdir(src_file):
            out_folder = os.path.join(dst_root, sub_dir, file_name)
            cmd = "mkdir -p \"" + out_folder + "\""
            os.system(cmd)
            dfs(src_root, os.path.join(sub_dir, file_name), dst_root, key_sufix)
        else:
            bare_file_name, ext = os.path.splitext(file_name)
            if ext != ".lua" and ext != ".png" and ext != ".jpg":
                target_dir = os.path.join(dst_root, sub_dir)
                cmd = "mkdir -p %s; cp -f %s %s" % (
                    target_dir, src_file, target_dir)
                os.system(cmd)
                continue

            dstExt = ext
            if ext == ".lua":
                dstExt = ".aul"
            dst_file = os.path.join(dst_root, sub_dir, bare_file_name + dstExt)
            key = [chr(ord(x) * pow(random.randint(10, 99),
                                    random.randint(1, 10)) % 255) for x in src_file]
            if len(key) > 200:
                key = key[:199]
            encrypt(src_file, dst_file, key=key)

def http_request(full_zip):
    payload = {}
    f1 = open(full_zip, "rb")
    files = {
        "file": f1,
    }
    url = "https://ly.uploadGame.cn/uploadgame"
    print("Before Request:", url)
    sys.stdout.flush()
    r = requests.post(url, data=payload, files=files)
    try:
        response = r.json()
        print "After Request ", response
    except Exception as e:
        response = None
        print "Error in upload file: ", r.text.encode("utf-8")
        sys.exit(-1)
    f1.close()
    return response


def create_zip(game_name, new_version):
    src_dir = os.path.join(root_path, "app")
    version_file = os.path.join(src_dir, "config.json")
    with open(version_file, "r") as f:
        content = json.load(f)
        version = content["version"]
        x, y, z = version.split(".")
        z = int(z) + 1
        if new_version != "-1" and re.match(r"\d+\.\d+\.\d+", new_version):
            content["version"] = new_version
        else:
            content["version"] = "%s.%s.%d" % (x, y, z)

        if not "gameId" in content:
            print("[Error] 请先在config.json里面设置gameId参数")
            return False
        game_id = int(content["gameId"])

    with open(version_file, "w") as f:
        json.dump(content, f)

    cmd = "rm -rf %s; mkdir -p %s" % (tmp_path, tmp_path)
    os.system(cmd)

    # 加密
    dfs(src_dir, "Images", tmp_path)
    dfs(src_dir, "Scripts", tmp_path)
    dfs(src_dir, "Frameworks", tmp_path)
    cmd = "cp %s %s" % (version_file, tmp_path)
    os.system(cmd)

    # 生成zip包
    ios_config_file = os.path.join(tmp_path, "ios.json")
    ios_config = {"type": 1}
    with open(ios_config_file, "w") as f:
        json.dump(ios_config, f)
    src_list = "Images Scripts Frameworks config.json ios.json"
    full_file_zip = "%s/%s_%s.zip" % (out_path, game_name, content["version"])
    ios_file_zip = "%s/%s_%s_ios.zip" % (out_path,
                                         game_name, content["version"])
    ios_script_file_zip = "%s/%s_%s_ios_script.zip" % (
        out_path, game_name, content["version"])
    cmd = "cd %s; zip -q -r -J %s %s" % (tmp_path, full_file_zip, src_list)
    os.system(cmd)

    # 苹果纯美术包
    ios_config = {"type": 2}
    with open(ios_config_file, "w") as f:
        json.dump(ios_config, f)
    src_list = "Images config.json ios.json"
    cmd = "cd %s; zip -q -r -J %s %s" % (tmp_path, ios_file_zip, src_list)
    os.system(cmd)

    ios_config = {"type": 3}
    with open(ios_config_file, "w") as f:
        json.dump(ios_config, f)
    src_list = "Scripts Frameworks config.json ios.json"
    cmd = "cd %s; zip -q -r -J %s %s" % (tmp_path,ios_script_file_zip, src_list)
    os.system(cmd)

    print("Zip Generated")

    # 上传配置
    response = http_request(full_file_zip,"")
    if not response:
        print("upload zip failed")
        return False
    full_url=response["httpUrl"]

    print("upload zip success")
    md5Process=os.popen("md5 %s | awk '{print $4}'"%(full_file_zip))
    md5Str=md5Process.read()
    print(md5Str)
    md5Str=md5Str[0:-1]
    md5Process.close()

    ####### md5第二种计算法 *** 
    # md5Str = hashlib.md5(open(full_file_zip, "rb").read()).hexdigest() 

    uploadGId=game_id
    if game_name == "Cocos":
        uploadGId=0

    pkgConfigUrl="https://ly.uploadgame.com/game_modify?gameId=%s&version=%s&url=%s&md5=%s" % (uploadGId, content["version"],full_url,md5Str)
    print(pkgConfigUrl)
    upResult=requests.get(pkgConfigUrl)
    if not upResult:
        print("no upResult")
        return False
    try:
        upResult = upResult.json()
        print "After up config "
    except Exception as e:
        response = None
        print "Error in upload config: ", r.text.encode("utf-8")
        sys.exit(-1)
    if upResult["code"]!=0:
        print("up config error")
        return False
    else:
        print("up config success")  
    return True

def main(game_name, version):
    create_zip(game_name, version)

main(sys.argv[1], sys.argv[2])