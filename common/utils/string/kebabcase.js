export const kebabcase = (str) => {
    // 处理连续的大写字符，将最后一个和第一个字符作为单词的开始节点
    str = str.replace(/([A-Z]+)(?=[A-Z][a-z])/g, (match) => match.toLowerCase() + '-');
    return str
        ?.replace(/([A-Z])/g, (match, _, index) => `${index > 0 ? '-' : ''}${match.toLowerCase()}`)
        .replace(/^./, (match) => match.toLowerCase());
};
