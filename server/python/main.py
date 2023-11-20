# from openai import OpenAI
from flask import Flask
from flask_cors import CORS
from contenttype import contentTypeRouter

app = Flask(__name__)
# CORS(app)
# api_key=""
# client = OpenAI(api_key=api_key)

# completion = client.chat.completions.create(
#   model="gpt-3.5-turbo",
#   messages=[
#     {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
#     {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
#   ]
# )
# print(completion.choices[0].message)

@app.route("/gpt")
def gpt():
    return "欢迎来到我的GPT服务！"


@app.route("/")
def main():
    return "欢迎来到我的Python服务！"

app.register_blueprint(contentTypeRouter)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)
