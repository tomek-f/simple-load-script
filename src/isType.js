const nullish = [
  null,
  undefined,
];

const isType = (val, ...types) => !nullish.includes(val) && types.includes(val.constructor);

// old Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()

export default isType;
