const CODES = {
  NO_DATA: 400,
  INVALID_DATA: 422,
};

const messages = {
  noName: '"name" is required',
  shortName: '"name" length must be at least 5 characters long',
  noQuantity: '"quantity" is required',
  invalidQuantity: '"quantity" must be a number larger than or equal to 1',
};

const nameSchema = (name) => {
  if (!name) {
    return { error: { code: CODES.NO_DATA, message: messages.noName } };
  }
  if (name.length < 5) {
    return { error: { code: CODES.INVALID_DATA, message: messages.shortName } };
  }
  return {};
};

const quantitySchema = (quantity) => {
  if (typeof quantity === 'number' && quantity < 1) {
    return { error: { code: CODES.INVALID_DATA, message: messages.invalidQuantity } };
  }
  if (!quantity) {
    return { error: { code: CODES.NO_DATA, message: messages.noQuantity } };
  }
  if (typeof quantity !== 'number') {
    return { error: { code: CODES.INVALID_DATA, message: messages.invalidQuantity } };
  }
  return {};
};

module.exports = {
  nameSchema,
  quantitySchema, 
};
