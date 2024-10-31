
export const equal = (obj1: any, obj2: any) => {
  // obj1,obj2的key完全相同，不存在多一个key或少一个key，并且每个key对应的value相同，并且要嵌套检查
  if(typeof obj1 !== typeof obj2) return false;
  if(typeof obj1 !== 'object') return obj1 === obj2;
  
  let _isSame = true;

  let _keys1 = Object.keys(obj1).filter(k=>obj1[k]!==undefined)
  let _keys2 = Object.keys(obj2).filter(k=>obj2[k]!==undefined)
  if (_keys1.length !== _keys2.length) return false
  const mergedKeys = Array.from(new Set(_keys1.concat(_keys2)))
  for (let key of mergedKeys) {
    if (!equal(obj1[key], obj2[key])) {
      _isSame = false;
      break;
    }
  }
  
  return _isSame
}