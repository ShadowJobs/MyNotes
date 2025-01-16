# 1, 等号运算符的运算和转换规则
    从上到下按照规则比较，直到能得到确切结果为止：

  - 两端类型相同，比较值
  - 两端存在NaN,返回 false
  - undefined 和 null只有与自身比较，或者互相比较时，才会返回true
  - 两端都是原始类型，转换成数字比较；一端是原始类型，一端是对象类型，把对象转换成原始类型后进入第1步
  - 对象如何转原始类型？
  - 如果对象拥有[Symbol.toPrimitive]方法，调用该方法 若该方法能得到原始值，使用该原始值； 若得不到原始值，抛出异常
  - 调用对象的valueOf方法 若该方法能得到原始值，使用该原始值； 若得不到原始值，进入下一步
  - 调用对象的tostring方法 若该方法能得到原始值，使用该原始值； 若得不到原始值，抛出异常

# 2, 标签模板
```js
//1， 格式化日期
function formatDate(strings, ...values) {
    return strings.reduce((acc, str, i) => {
        let value = values[i - 1];
        if (value instanceof Date) {
            value = value.toISOString().split('T')[0]; // 格式化日期为 YYYY-MM-DD
        }
        return acc + value + str;
    });
}

const date = new Date();
const result = formatDate`Today's date is ${date}`;
console.log(result); // 输出: Today's date is YYYY-MM-DD

//2， 防止 XSS 攻击
function sanitize(strings, ...values) {
    const sanitizeValue = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                                                  .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
                                                  .replace(/'/g, '&#39;');
    return strings.reduce((acc, str, i) => acc + str + (values[i] ? sanitizeValue(values[i]) : ''), '');
}

const input = '<script>alert("XSS")</script>';
const result = sanitize`User input: ${input}`;
console.log(result); // 输出: User input: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;

// 3， 多语言支持
// 4， 格式化货币 

```