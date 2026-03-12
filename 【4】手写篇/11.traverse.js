// 实现一个函数，实现树对象的层序遍历
// 层序遍历：从根节点开始，按照层级顺序，从左到右遍历所有节点
// 例如：
// 输入：{ value: 1, children: [{ value: 2 }, { value: 3 }] }
// 输出：[[1], [2, 3]]

const root = {
  value: 1,
  children: [
    {
      value: 2,
      children: [
        { value: 4, children: [{ value: 8 }, { value: 9 }] },
        { value: 5, children: [{ value: 10 }, { value: 11 }] },
      ],
    },
    {
      value: 3,
      children: [
        { value: 6, children: [{ value: 12 }, { value: 13 }] },
        { value: 7, children: [{ value: 14 }, { value: 15 }] },
      ],
    },
  ],
};

function traverse(root, res = [], level = 0) {
  if (!root) {
    return []
  }

  if (Array.isArray(res[level])) {
    res[level].push(root.value)
  } else {
    res[level] = [root.value]
  }

  if (Array.isArray(root.children)) {
    level++
    for (const child of root.children) {
      traverse(child, res, level)
    }
    level--
  }

  return res;
}

function whileTree(root) {
  if (!root) {
    return []
  }

  const res = [];
  const queue = [root];
  let depth = 0;

  while (queue.length !== 0) {
    const size = queue.length;

    for (i = 0; i < size; i++) {
      const cur = queue.shift();

      if (Array.isArray(res[depth])) {
        res[depth].push(cur.value);
      } else {
        res[depth] = [cur.value];
      }

      if (!cur.children) {
        continue;
      }

      queue.push(...cur.children);
    }

    depth++;
  }

  return res;
}

const res = traverse(root)
const res1 = whileTree(root)

console.log(res, res1);