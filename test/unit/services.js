const Sinon = require('sinon');
const { expect } = require('chai');

const ProductsModel = require('../../models/productsModel');
const ProductsService = require('../../services/productsService');
const SalesModel = require('../../models/salesModel');
const SalesService = require('../../services/salesService');
const SalesProductsModel = require('../../models/salesProductsModel');

describe('--PRODUCTS SERVICE UNIT TESTS--', () => {
  describe('1 - Call products service to insert product', () => {
    beforeEach(async () => {
      Sinon.stub(ProductsModel, 'create')
        .resolves({ id: 2, name: 'produto2', quantity: '20' });
    });
  
    afterEach(async () => {
      ProductsModel.create.restore();
    });
  
    describe('A - with invalid name', () => {
      const requestQuantity = 10;
      const noName = null
      const shortName = 'pr'
      it('no name returns error with code 400 and message \'"name" is required\'', async () => {
        const response = await ProductsService.create(noName, requestQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(400);
        expect(message).to.be.eq('"name" is required');
      });
  
      it('short name returns error with code 422 and message \'"name" length must be at least 5 characters long\'', async () => {
        const response = await ProductsService.create(shortName, requestQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"name" length must be at least 5 characters long');
      });
    });
  
    describe('B - with invalid quantity', () => {
      const requestName = 'product100';
      const zeroQuantity = Number(0);
      const negativeQuantity = -1;
      const stringQuantity = 'string';
      const noQuantity = null;

      it('no quantity returns error with code 400 and message \'"quantity" is required\'', async () => {
        const response = await ProductsService.create(requestName, noQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(400);
        expect(message).to.be.eq('"quantity" is required');
      });
  
      it('zero quantity returns error with code 422 and message \'"quantity" must be a number larger than or equal to 1\'', async () => {
        const response = await ProductsService.create(requestName, zeroQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"quantity" must be a number larger than or equal to 1');
      });

      it('negative quantity returns error with code 422 and message \'"quantity" must be aa number larger than or equal to 1\'', async () => {
        const response = await ProductsService.create(requestName, negativeQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"quantity" must be a number larger than or equal to 1');
      });

      it('string quantity returns error with code 422 and message \'"quantity" must be a number larger than or equal to 1\'', async () => {
        const response = await ProductsService.create(requestName, stringQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const {code, message }= error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"quantity" must be a number larger than or equal to 1');
      });
    });
        
    describe('C - when product exists', () => {
      const alreadyExists = 'product'
      const quantity = 10;
      
      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'findByName')
          .resolves(true);
      });

      afterEach(async () => {
        ProductsModel.findByName.restore();
      });

      it('returns an object', async () => {
        const response = await ProductsService.create(alreadyExists, quantity);

        expect(response).to.be.a('object');
      });

      it('contains an error', async () => {
        const response = await ProductsService.create(alreadyExists, quantity);

        expect(response).to.have.property('error');
      });

      it('contains a code and message', async () => {
        const { error } = await ProductsService.create(alreadyExists, quantity);

        expect(error).to.have.all.keys('code', 'message');
      });

      it('the return code is 409 and the message is \'Product already exists\'', async () => {
        const { error: { code, message } } = await ProductsService.create(alreadyExists, quantity);

        expect(code).to.be.eq(409);
        expect(message).to.be.eq('Product already exists');
      });
    });
  
    describe('D - when request is succesful', () => {
      const REQUEST = {
        requestName: 'produto2',
        requestQuantity: 20,
      };

      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'findByName')
        .resolves(false);
      });

      afterEach(async () => {
        ProductsModel.findByName.restore();
      });

      const { requestName, requestQuantity } = REQUEST;

      it('returns an object', async () => {
        const response = await ProductsService.create(requestName, requestQuantity);

        expect(response).to.be.a('object');
      });

      it('contains the keys { id, name, quantity }', async () => {
        const response = await ProductsService.create(requestName, requestQuantity);

        expect(response).to.have.all.keys('id', 'name', 'quantity');
      });

      it('the values correspond to the created product', async () => {
        const { id, name, quantity } = await ProductsService.create(requestName, requestQuantity);

        expect(id).to.be.eq(2);
        expect(name).to.be.eq(requestName);
        expect(+quantity).to.be.eq(requestQuantity);
      });
    });
  });

  describe('2 - Call products service to get all products', () => {
    describe('A - when request returns no products', () => {
      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'getAll')
          .resolves([]);
      });

      afterEach(async () => {
        ProductsModel.getAll.restore();
      });

      it('returns an array', async () => {
        const response = await ProductsService.getAll();

        expect(response).to.be.a('array');
      });

      it('is empty', async () => {
        const response = await ProductsService.getAll();

        expect(response.length).to.be.eq(0);
      });
    });

    describe('B - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'getAll')
          .resolves([{
            id: 1,
            name: 'product',
            quantity: 99,
          }]);
      });
  
      afterEach(async () => {
        ProductsModel.getAll.restore();
      });

      it('returns an array', async () => {
        const response = await ProductsService.getAll();

        expect(response).to.be.a('array');
      });

      it('contains list of objects', async () => {
        const response = await ProductsService.getAll();

        const sampleProduct = response[0];

        expect(sampleProduct).to.be.a('object');
      });

      it('contains the keys { id, name, quantity }', async () => {
        const [sampleProduct] = await ProductsService.getAll();

        expect(sampleProduct).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });

  describe('3 - Call products service to find product by id', () => {
    describe('A - when id does not exist', () => {
      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'findById')
          .resolves(null);
      });

      afterEach(async () => {
        ProductsModel.findById.restore();
      });

      const INVALID_ID = 9999;
      it('returns an object', async () => {
        const response = await ProductsService.findById(INVALID_ID);

        expect(response).to.be.a('object');
      });

      it('contains an error', async () => {
        const response = await ProductsService.findById(INVALID_ID);

        expect(response).to.have.property('error');
      });

      it('contains a code and a message', async () => {
        const { error } = await ProductsService.findById(INVALID_ID);

        expect(error).to.have.all.keys('code', 'message');
      });

      it('returns code 404 and message \'Product not found\'', async () => {
        const { error: { code, message } } = await ProductsService.findById(INVALID_ID);

        expect(code).to.be.eq(404);
        expect(message).to.be.eq('Product not found');
      });
    });

    describe('B - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'findById')
          .resolves({
            id: 1,
            name: 'produto',
            quantity: 80,
          });
      });

      afterEach(async () => {
        ProductsModel.findById.restore();
      });

      const VALID_ID = 1;
      it('returns an object', async () => {
        const product = await ProductsService.findById(VALID_ID);

        expect(product).to.be.a('object');
      });

      it('contains the keys { id, name, quantity }', async () => {
        const product = await ProductsService.findById(VALID_ID);

        expect(product).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });

  describe('4 - Call products service to update product by id', () => {
    const requestQuantity = 10;
    const shortName = 'pr';
    const requestName = 'product100';
    const zeroQuantity = Number(0);
    const negativeQuantity = -1;
    const stringQuantity = 'string';
    const VALID_ID = 1;

    describe('A - with invalid name', () => {
      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'update')
          .resolves(null)
      });

      afterEach(async () => {
        ProductsModel.update.restore();
      });

      it('no name returns error with code 400 and message \'"name" is required \'', async () => {
        const response = await ProductsService.update(VALID_ID, null, requestQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(400);
        expect(message).to.be.eq('"name" is required');
      });

      it('short name returns error with code 422 and message \'"name" length must be at least 5 characters long\'', async () => {
        const response = await ProductsService.update(VALID_ID, shortName, requestQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"name" length must be at least 5 characters long');
      });
    });

    describe('B - with invalid quantity', () => {
      it('no quantity returns error with code 400 and message \'"quantity" is required \'', async () => {
        const response = await ProductsService.update(VALID_ID, requestName, null);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(400);
        expect(message).to.be.eq('"quantity" is required');
      });

      it('zero quantity returns error with code 422 and message \'"quantity" must be a number larger than or equal to 1\'', async () => {
        const response = await ProductsService.update(VALID_ID, requestName, zeroQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"quantity" must be a number larger than or equal to 1');
      });

      it('negative quantity returns error with code 422 and message \'"quantity" must be aa number larger than or equal to 1\'', async () => {
        const response = await ProductsService.update(VALID_ID, requestName, negativeQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"quantity" must be a number larger than or equal to 1');
      });

      it('string quantity returns error with code 422 and message \'"quantity" must be a number larger than or equal to 1\'', async () => {
        const response = await ProductsService.update(VALID_ID, requestName, stringQuantity);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const {code, message }= error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"quantity" must be a number larger than or equal to 1');
      });
    });

    describe('C - when id does not exist', () => {
      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'update')
          .resolves(null);
        Sinon.stub(ProductsModel, 'findById')
          .resolves(null);
      });

      afterEach(async () => {
        ProductsModel.findById.restore();
        ProductsModel.update.restore();
      });

      const INVALID_ID = 9999;
      it('returns an object', async () => {
        const response = await ProductsService.update(INVALID_ID, requestName, requestQuantity);

        expect(response).to.be.a('object');
      });

      it('contains an error', async () => {
        const response = await ProductsService.update(INVALID_ID, requestName, requestQuantity);

        expect(response).to.have.property('error');
      });

      it('contains a code and a message', async () => {
        const { error } = await ProductsService.update(INVALID_ID, requestName, requestQuantity);

        expect(error).to.have.all.keys('code', 'message');
      });

      it('returns code 404 and message \'Product not found\'', async () => {
        const { error: { code, message } } = await ProductsService.update(INVALID_ID, requestName, requestQuantity);

        expect(code).to.be.eq(404);
        expect(message).to.be.eq('Product not found');
      });
    });

    describe('D - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'update')
          .resolves({ id: 1, name: 'edited name', quantity: 12 });
        Sinon.stub(ProductsModel, 'findById')
          .resolves(true);
      });

      afterEach(async () => {
        ProductsModel.update.restore();
        ProductsModel.findById.restore();
      });

      it('returns an object', async () => {
        const product = await ProductsService.update(VALID_ID, requestName, requestQuantity);

        expect(product).to.be.a('object');
      });

      it('contains all keys { id, name, quantity }', async () => {
        const product = await ProductsService.update(VALID_ID, requestName, requestQuantity);

        expect(product).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });

  describe('5 - Call products service to delete product by id', () => {
    describe('A - when id does not exist', () => {
      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'removeById')
          .resolves(null);
        Sinon.stub(ProductsModel, 'findById')
          .resolves(null);
      });

      afterEach(async () => {
        ProductsModel.removeById.restore();
        ProductsModel.findById.restore();
      });

      const INVALID_ID = 9999;
      it('returns an object', async () => {
        const response = await ProductsService.removeById(INVALID_ID);

        expect(response).to.be.a('object');
      });

      it('contains an error', async () => {
        const response = await ProductsService.removeById(INVALID_ID);

        expect(response).to.have.property('error');
      });

      it('contains a code and a message', async () => {
        const { error } = await ProductsService.removeById(INVALID_ID);

        expect(error).to.have.all.keys('code', 'message');
      });

      it('returns code 404 and message \'Product not found\'', async () => {
        const { error: { code, message } } = await ProductsService.removeById(INVALID_ID);

        expect(code).to.be.eq(404);
        expect(message).to.be.eq('Product not found');
      });
    });

    describe('B - when request is succesful', () => {
      const VALID_ID = 1;

      beforeEach(async () => {
        Sinon.stub(ProductsModel, 'removeById')
          .resolves(true);
        Sinon.stub(ProductsModel, 'findById')
          .resolves({ id: 1, name: 'deleted product', quantity: 2 });
      });

      afterEach(async () => {
        ProductsModel.removeById.restore();
        ProductsModel.findById.restore();
      });

      it('returns an object', async () => {        
        const product = await ProductsService.removeById(VALID_ID);

        expect(product).to.be.a('object');
      });

      it('contains all keys { id, name, quantity }', async () => {
        const product = await ProductsService.removeById(VALID_ID);

        expect(product).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });
});

describe('--SALES SERVICE UNIT TESTS--', () => {
  describe('1 - Call sales service to insert sales', () => {
    describe('A - with invalid data', () => {
      it('no request body returns code 400 and message \'"product_id" is required\'', async () => {
        const response = await SalesService.create([]);

        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        
        const { code, message } = error;
        expect(code).to.be.eq(400);
        expect(message).to.be.eq('"product_id" is required');
      });
      
      it('no product_id returns code 400 and message \'"product_id" is required\'', async () => {
        const response = await SalesService.create([{ quantity: 8 }]);

        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        
        const { code, message } = error;
        expect(code).to.be.eq(400);
        expect(message).to.be.eq('"product_id" is required');
      });

      it('no quantity returns code 400 and message \'"quantity" is required\'', async () => {
        const response = await SalesService.create([{ product_id: 1 }]);

        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        
        const { code, message } = error;
        expect(code).to.be.eq(400);
        expect(message).to.be.eq('"quantity" is required');
      });

      it('invalid quantity returns code 422 and message \'"quantity" must be a number larger than or equal to 1\'', async () => {
        let response = await SalesService.create([{ product_id: 1, quantity: 0 }]);

        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        
        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"quantity" must be a number larger than or equal to 1');

        response = await SalesService.create([{ product_id: 1, quantity: -1 }]);

        expect(response).to.have.property('error');
        expect(response.error).to.have.all.keys('code', 'message');
        
        expect(response.error.code).to.be.eq(422);
        expect(response.error.message).to.be.eq('"quantity" must be a number larger than or equal to 1');

        response = await SalesService.create([{ product_id: 1, quantity: 'string' }]);

        expect(response).to.have.property('error');
        expect(response.error).to.have.all.keys('code', 'message');

        expect(response.error.code).to.be.eq(422);
        expect(response.error.message).to.be.eq('"quantity" must be a number larger than or equal to 1');
      });

      it('when product does not exist returns code 422 and message \'Product not found\'', async () => {
        Sinon.stub(ProductsModel, 'findById')
          .resolves(null);
        
        const response = await SalesService.create([{ product_id: 999, quantity: 1}]);

        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');

        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('Product not found');

        ProductsModel.findById.restore();
      });
    });

    describe('B - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(SalesModel, 'create')
          .resolves({
            id: 1,
          });
        Sinon.stub(SalesProductsModel, 'create')
          .resolves({ salesId: 1, itemUpdated: { product_id: 1, quantity: 1 } });
        Sinon.stub(ProductsModel, 'findById')
          .resolves({
            product_id: 1,
            quantity: 3,
          });
        Sinon.stub(ProductsModel, 'update')
          .resolves(true);
      });
  
      afterEach(async () => {
        SalesModel.create.restore();
        SalesProductsModel.create.restore();
        ProductsModel.findById.restore();
        ProductsModel.update.restore();
      });
      const sampleRequest = [{ product_id: 1, quantity: 3 }];

      it('returns an object', async () => {
        const response = await SalesService.create(sampleRequest);

        expect(response).to.be.a('object');
      });

      it('contains the keys id and itemsSold', async () => {
        const response = await SalesService.create(sampleRequest);

        expect(response).to.have.all.keys('id', 'itemsSold');
      });

      it('contains a list of the items sold', async () => {
        const { itemsSold } = await SalesService.create(sampleRequest);

        expect(itemsSold[0]).to.have.all.keys('product_id', 'quantity');
      });

      it('calls SalesProducts model create with { salesId, productId, quantity }', async () => {
        const { id, itemsSold } = await SalesService.create(sampleRequest);

        expect(SalesProductsModel.create.calledWith(1, 1, 3)).to.be.eq(true);
      });
    });
  });

  describe('2 - Call sales service to get all sales', () => {
    describe('A - when request returns no sales', () => {
      beforeEach(async () => {
        Sinon.stub(SalesModel, 'getAll')
          .resolves([]);
      });

      afterEach(async () => {
        SalesModel.getAll.restore();
      });

      it('returns an array', async () => {
        const response = await SalesService.getAll();

        expect(response).to.be.a('array');
      });

      it('is empty', async () => {
        const response = await SalesService.getAll();

        expect(response.length).to.be.eq(0);
      });
    });

    describe('B - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(SalesModel, 'getAll')
          .resolves(  [
            {
              "saleId": 1,
              "date": "2021-09-09T04:54:29.000Z",
              "product_id": 1,
              "quantity": 2
            },
            {
              "saleId": 1,
              "date": "2021-09-09T04:54:54.000Z",
              "product_id": 2,
              "quantity": 2
            }
          ]);
      });
  
      afterEach(async () => {
        SalesModel.getAll.restore();
      });

      it('returns an array', async () => {
        const response = await SalesService.getAll();

        expect(response).to.be.a('array');
      });

      it('contains list of objects', async () => {
        const response = await SalesService.getAll();

        const sampleProduct = response[0];

        expect(sampleProduct).to.be.a('object');
      });

      it('contains the keys { id, name, quantity }', async () => {
        const [sampleProduct] = await SalesService.getAll();

        expect(sampleProduct).to.have.all.keys('saleId', 'date', 'product_id', 'quantity');
      });
    });
  });

  describe('3 - Call sales service to find sales by id', () => {
    const VALID_ID = 1;
    const INVALID_ID = 777;

    describe('A - when id does not exist', () => {
      beforeEach(async () => {
        Sinon.stub(SalesModel, 'findById')
          .resolves(null);
      });

      afterEach(async () => {
        SalesModel.findById.restore();
      });

      const INVALID_ID = 9999;
      it('returns an object', async () => {
        const response = await SalesService.findById(INVALID_ID);

        expect(response).to.be.a('object');
      });

      it('contains an error', async () => {
        const response = await SalesService.findById(INVALID_ID);

        expect(response).to.have.property('error');
      });

      it('contains a code and a message', async () => {
        const { error } = await SalesService.findById(INVALID_ID);

        expect(error).to.have.all.keys('code', 'message');
      });

      it('returns code 404 and message \'Sale not found\'', async () => {
        const { error: { code, message } } = await SalesService.findById(INVALID_ID);

        expect(code).to.be.eq(404);
        expect(message).to.be.eq('Sale not found');
      });
    });

    describe('B - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(SalesModel, 'findById')
          .resolves([
            { 
              "date": "2021-09-09T04:54:29.000Z",
              "product_id": 1,
              "quantity": 2
            },
            {
              "date": "2021-09-09T04:54:54.000Z",
              "product_id": 2,
              "quantity": 2
            }
          ]);
      });

      afterEach(async () => {
        SalesModel.findById.restore();
      });

      const VALID_ID = 1;
      it('returns an array', async () => {
        const product = await SalesService.findById(VALID_ID);

        expect(product).to.be.a('array');
      });

      it('contains a list of sales', async () => {
        const sales = await SalesService.findById(VALID_ID);

        const saleSample = sales[0];

        expect(saleSample).to.have.all.keys('date', 'product_id', 'quantity');
      });
    });
  });

  describe('4 - Call sales service to update product by id', () => {
    const requestQuantity = 10;
    const requestProductId = 1;
    const requestSaleId = 1;
    const zeroQuantity = Number(0);
    const negativeQuantity = -1;
    const stringQuantity = 'string';

    describe('A - with invalid product_id', () => {
      it('no request body returns code 400 and message \'"product_id" is required\'', async () => {
        const response = await SalesService.update([]);

        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        
        const { code, message } = error;
        expect(code).to.be.eq(400);
        expect(message).to.be.eq('"product_id" is required');
      });

      it('no product_id returns error with code 400 and message \'"product_id" is required\'', async () => {
        const response = await SalesService.update([{ id: requestSaleId, product_id: null, quantity: requestQuantity }]);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(400);
        expect(message).to.be.eq('"product_id" is required');
      });

      it('when product does not exist returns error with code 422 and message \'Product not found', async () => {
        Sinon.stub(ProductsModel, 'findById')
          .resolves(null);
        
        const response = await SalesService.update([{ id: requestSaleId, product_id: 999, quantity: requestQuantity }]);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('Product not found');

        ProductsModel.findById.restore();
      });
    });

    describe('B - with invalid quantity', () => {
      it('no quantity returns error with code 400 and message\'"quantity" is required\'', async () => {
        const response = await SalesService.update([{ id: requestSaleId, product_id: requestProductId, quantity: null }]);

        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(400);
        expect(message).to.be.eq('"quantity" is required');
      });

      it('zero quantity returns error with code 422 and message \'"quantity" must be a number larger than or equal to 1\'', async () => {
        const response = await SalesService.update([{ id: requestSaleId, product_id: requestProductId, quantity: zeroQuantity }]);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"quantity" must be a number larger than or equal to 1');
      });

      it('negative quantity returns error with code 422 and message \'"quantity" must be aa number larger than or equal to 1\'', async () => {
        const response = await SalesService.update([{ id: requestSaleId, product_id: requestProductId, quantity: negativeQuantity }]);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const { code, message } = error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"quantity" must be a number larger than or equal to 1');
      });

      it('string quantity returns error with code 422 and message \'"quantity" must be a number larger than or equal to 1\'', async () => {
        const response = await SalesService.update([{ id: requestSaleId, product_id: requestProductId, quantity: stringQuantity }]);
  
        expect(response).to.have.property('error');
        const { error } = response;
        expect(error).to.have.all.keys('code', 'message');
        const {code, message }= error;
        expect(code).to.be.eq(422);
        expect(message).to.be.eq('"quantity" must be a number larger than or equal to 1');
      });
    });

    describe('D - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(SalesProductsModel, 'update')
          .resolves({
            saleId: 1,
            itemUpdated: [{
              productId: 1,
              quantity: 10,
            }],
          });
        Sinon.stub(ProductsModel, 'findById')
          .resolves({
            product_id: 1,
            quantity: 10,
          });
      });

      afterEach(async () => {
        SalesProductsModel.update.restore();
        ProductsModel.findById.restore();
      });

      it('returns an object', async () => {
        const sale = await SalesService.update([{ id: requestSaleId, product_id: requestProductId, quantity: requestQuantity }]);

        expect(sale).to.be.a('object');
      });

      it('contains all keys { salesId, itemUpdated }', async () => {
        const sale = await SalesService.update([{ id: requestSaleId, product_id: requestProductId, quantity: requestQuantity }]);

        expect(sale).to.have.all.keys('saleId', 'itemUpdated');
      });

      it('contains the updated item in an array', async () => {
        const { itemUpdated } = await SalesService.update([{ id: requestSaleId, product_id: requestProductId, quantity: requestQuantity }]);
        
        expect(itemUpdated[0]).to.be.a('object');
        expect(itemUpdated[0]).to.have.all.keys('product_id', 'quantity');
      });
    });
  });

  describe('5 - Call sales service to remove sale by id', () => {
    describe('A - when id does not exist', () => {
      beforeEach(async () => {
        Sinon.stub(SalesModel, 'removeById')
          .resolves(null);
        Sinon.stub(SalesModel, 'findById')
          .resolves(null);
        Sinon.stub(ProductsModel, 'update')
          .resolves(true);
        Sinon.stub(ProductsModel, 'findById')
          .resolves(true);
      });

      afterEach(async () => {
        SalesModel.removeById.restore();
        SalesModel.findById.restore();
        ProductsModel.update.restore();
        ProductsModel.findById.restore();
      });

      const INVALID_ID = 9999;
      it('returns an object', async () => {
        const response = await SalesService.removeById(INVALID_ID);

        expect(response).to.have.property('error');
      });

      it('contains a code and a message', async () => {
        const { error } = await SalesService.removeById(INVALID_ID);

        expect(error).to.have.all.keys('code', 'message');
      });

      it('returns code 404 and message \'Product not found\'', async () => {
        const { error: { code, message } } = await SalesService.removeById(INVALID_ID);

        expect(code).to.be.eq(404);
        expect(message).to.be.eq('Sale not found');
      });
    });

    describe('B - when request is succesful', () => {
      const VALID_ID = 1;

      beforeEach(async () => {
        Sinon.stub(SalesModel, 'removeById')
          .resolves(true);
        Sinon.stub(SalesModel, 'findById')
          .resolves([
            {
              "date": "2021-09-09T04:54:29.000Z",
              "product_id": 1,
              "quantity": 2
            },
            {
              "date": "2021-09-09T04:54:54.000Z",
              "product_id": 2,
              "quantity": 2
            }
          ]);
          Sinon.stub(ProductsModel, 'update')
            .resolves(true);
          Sinon.stub(ProductsModel, 'findById')
            .resolves(true);
      });

      afterEach(async () => {
        SalesModel.removeById.restore();
        SalesModel.findById.restore();
        ProductsModel.update.restore();
        ProductsModel.findById.restore();
      });

      it('returns an array', async () => {        
        const sales = await SalesService.removeById(VALID_ID);

        expect(sales).to.be.a('array');
      });

      it('is not empty', async () => {
        const sales = await SalesService.removeById(VALID_ID);

        expect(sales.length).to.be.greaterThanOrEqual(1);
      });

      it('contains objects with all keys { date, product_id, quantity }', async () => {
        const [sampleSale] = await SalesService.removeById(VALID_ID);

        expect(sampleSale).to.have.all.keys('date', 'product_id', 'quantity');
      });
    });
  });
});
