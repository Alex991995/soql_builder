const filteringOperations = {
  equal: "=",
  notEqual: "!=",
  greaterThan: ">",
  lessThan: "<",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<="
};

let filteringOptions = [];

for (const value of Object.values(filteringOperations)) {
  filteringOptions.push({ label: value, value: value });
}

export { filteringOperations, filteringOptions };
