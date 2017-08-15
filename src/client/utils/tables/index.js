export const getTableElementById = (table, id) => {
  for (let i = 0; i < table.length; i += 1) {
    if (table[i].id === id) {
      return table[i];
    }
  }
  return null;
};
