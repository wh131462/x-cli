export const camel = (str) =>
    str
        .toString()
        .split('-') // 将字符串以连字符为分隔符分割成数组
        .map((word, index) => {
            // 捕获第一个单词，保持其小写，其余单词转成大写
            return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(''); // 将数组元素连接成一个字符串
