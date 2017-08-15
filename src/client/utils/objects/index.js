export const merge = (obj1, obj2) => {
  for (const key in obj2) {
    try {
      if (obj2[key] !== null) {
        if (obj2[key].constructor === Object) {
          if (!obj1[key]) {
            obj1[key] = {};
          }
          obj1[key] = merge(obj1[key], obj2[key]);
        } else if (obj2[key].constructor === Array) {
          if (!obj1[key]) {
            obj1[key] = [];
          }
          if (obj2[key].length !== 0) {
            obj1[key] = obj2[key];
          }
        } else if (obj2[key].constructor == Boolean) {
          obj1[key] = obj2[key];
        } else {
          obj1[key] = obj2[key];
        }
      } else if (!obj1[key]) {
        obj1[key] = undefined;
      }
    } catch (e) {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
};
