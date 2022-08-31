const Sinon = require('sinon');
const { expect } = require('chai');

const ProductsService = require('../../services/productsService');
const ProductsController = require('../../controllers/productsController');
const SalesService = require('../../services/salesService');
const SalesController = require('../../controllers/salesController');

const request = {};
const response = {};

beforeEach(async() => {
  response.status = Sinon.stub()
    .returns(response);
  response.json = Sinon.stub()
    .returns();
});

describe('--PRODUCTS CONTROLLER UNIT TESTS--', () => {
  describe('1 - Send /POST request to products controller to insert new product', () => {

    describe('A - when request has invalid data', () => {

      it('no name returns code 400 and message \'"name" is required\'', async () => {
        Sinon.stub(ProductsService, 'create')
          .resolves({
            error: {
              code: 400,
              message: '"name" is required',
            },
          });

        request.body = { name: null, quantity: 10 };
  
        await ProductsController.create(request, response);
  
        expect(response.status.calledWith(400)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"name" is required' }));

        ProductsService.create.restore();
      });
  
      it('short name returns code 422 and message \'"name" length must be at least 5 characters long\'', async () => {
        Sinon.stub(ProductsService, 'create')
          .resolves({
            error: {
              code: 422,
              message: '"name" length must be at least 5 characters long',
            },
          });

        request.body = { name: 'pr', quantity: 10 };
  
        await ProductsController.create(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"name" length must be at least 5 characters long' }));

        ProductsService.create.restore();
      });
  
      it('existing name returns code 409 and message \'Product already exists\'', async () => {
        Sinon.stub(ProductsService, 'create')
          .resolves({
            error: {
              code: 409,
              message: 'Product already exists',
            },
          });

        request.body = { name: 'produto', quantity: 10 };
  
        await ProductsController.create(request, response);
  
        expect(response.status.calledWith(409)).to.be.eq(true);
        expect(response.json.calledWith({ message: 'Product already exists' }));
  
        ProductsService.create.restore();
      });
  
      it('no quantity returns code 400 and message \'"quantity" is required\'', async () => {
        Sinon.stub(ProductsService, 'create')
        .resolves({
          error: {
            code: 400,
            message: '"quantity" is required',
          },
        });
        request.body = { name: 'produto3', quantity: null };
  
        await ProductsController.create(request, response);
  
        expect(response.status.calledWith(400)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" is required' }));

        ProductsService.create.restore();
      });
  
      it('invalid quantity returns code 422 and message \'"quantity" must be a number larger than or equal to 1\'', async () => {
        Sinon.stub(ProductsService, 'create')
        .resolves({
          error: {
            code: 422,
            message: '"quantity" must be a number larger than or equal to 1',
          },
        });
        request.body = { name: 'produto3', quantity: -1 };
  
        await ProductsController.create(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));
  
        request.body = { name: 'produto3', quantity: 0 };
  
        await ProductsController.create(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));
  
        request.body = { name: 'produto3', quantity: 'string' };
  
        await ProductsController.create(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));

        ProductsService.create.restore();
      });
    });
  
    describe('B - when request is succesful', () => {
      request.body = { name: 'produto1000', quantity: 200 };
  
      beforeEach(async () => {
        Sinon.stub(ProductsService, 'create')
          .resolves({
            id: 2,
            name: 'produto1000',
            quantity: '200',
          });
      });
  
      afterEach(async () => {
        ProductsService.create.restore();
      });
  
      it('returns code 201', async () => {
        await ProductsController.create(request, response);
  
        expect(response.status.calledWith(201)).to.be.eq(true);
      });
  
      it('returns the created product object', async () => {
        await ProductsController.create(request, response);
  
        expect(response.json.calledWith({
          id: 2,
          name: 'produto1000',
          quantity: '200',
        })).to.be.eq(true);
      });
    });
  });
  
  describe('2 - Send /GET request to products controller to get all products', () => {
    describe('A - when request yields no products', () => {
      beforeEach(async () => {
        Sinon.stub(ProductsService, 'getAll')
          .resolves([]);
      });

      afterEach(async () => {
        ProductsService.getAll.restore();
      });
      
      it('returns code 200', async () => {
        await ProductsController.getAll(request, response);

        expect(response.status.calledWith(200)).to.be.eq(true);
      });

      it('returns an empty list', async () => {
        await ProductsController.getAll(request, response);

        expect(response.json.calledWith([])).to.be.eq(true);
      });
    });

    describe('B - when request is succesful', () => {
      const RETURN_LIST = [
        {
          "id": 1,
          "name": "produto A",
          "quantity": 10
        },
        {
          "id": 2,
          "name": "produto B",
          "quantity": 20
        }
      ];

      beforeEach(async () => {
        Sinon.stub(ProductsService, 'getAll')
          .resolves(RETURN_LIST);
      });

      afterEach(async () => {
        ProductsService.getAll.restore();
      });

      it('returns code 200', async () => {
        await ProductsController.getAll(request, response);

        expect(response.status.calledWith(200)).to.be.eq(true);
      });

      it('returns a list of products', async () => {
        await ProductsController.getAll(request, response);

        expect(response.json.calledWith(RETURN_LIST)).to.be.eq(true);
      });
    });
  });

  describe('3 - Send /GET requests to products controller to find product by id', () => {
    describe('A - when product is not found', () => {
      request.params = { id: 777 };

      beforeEach(async () => {
        Sinon.stub(ProductsService, 'findById').
          resolves({
            error: {
              code: 404,
              message: 'Product not found',
            },
          });
      });

      afterEach(async () => {
        ProductsService.findById.restore();
      });

      it('returns code 404', async () => {
        await ProductsController.findById(request, response);

        expect(response.status.calledWith(404)).to.be.eq(true);
      });

      it('returns a message "Product not found"', async () => {
        await ProductsController.findById(request, response);

        expect(response.json.calledWith({ message: 'Product not found' })).to.be.eq(true);
      });
    });

    describe('B - when request is succesful', () => {
      request.params = { id: 1 };

      beforeEach(async () => {
        Sinon.stub(ProductsService, 'findById').
          resolves({
            id: 1,
            name: 'produto',
            quantity: '10',
          });
      });

      afterEach(async () => {
        ProductsService.findById.restore();
      });

      it('returns code 200', async () => {
        await ProductsController.findById(request, response);

        expect(response.status.calledWith(200)).to.be.eq(true);
      });

      it('returns the product', async () => {
        await ProductsController.findById(request, response);

        expect(response.json.calledWith({
          id: 1,
          name: 'produto',
          quantity: '10',
        })).to.be.eq(true);
      })
    });
  });

  describe('4 - Send /PUT request to products controller to update product', () => {
    request.params = { id: 2 };

    describe('A - when request has invalid data', () => {
      it('no name returns code 400 and message \'"name" is required\'', async () => {
        Sinon.stub(ProductsService, 'update')
          .resolves({
            error: {
              code: 400,
              message: '"name" is required',
            },
          });

        request.body = { name: null, quantity: 10 };
  
        await ProductsController.update(request, response);
  
        expect(response.status.calledWith(400)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"name" is required' }));

        ProductsService.update.restore();
      });

      it('short name returns code 422 and message \'"name" length must be at least 5 characters long\'', async () => {
        Sinon.stub(ProductsService, 'update')
          .resolves({
            error: {
              code: 422,
              message: '"name" length must be at least 5 characters long',
            },
          });

        request.body = { name: 'pr', quantity: 10 };
  
        await ProductsController.update(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"name" length must be at least 5 characters long' }));

        ProductsService.update.restore();
      });

      it('no quantity returns code 400 and message \'"quantity" is required\'', async () => {
        Sinon.stub(ProductsService, 'update')
          .resolves({
            error: {
              code: 400,
              message: '"quantity" is required',
            },
          });

        request.body = { name: 'produto', quantity: null };
  
        await ProductsController.update(request, response);
  
        expect(response.status.calledWith(400)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" is required' }));

        ProductsService.update.restore();
      });

      it('invalid quantity returns code 422 and message \'"quantity" must be larger than or equal to 1\'', async () => {
        Sinon.stub(ProductsService, 'update')
        .resolves({
          error: {
            code: 422,
            message: '"quantity" must be a number larger than or equal to 1',
          },
        });
        request.body = { name: 'produto3', quantity: -1 };
  
        await ProductsController.update(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));
  
        request.body = { name: 'produto3', quantity: 0 };
  
        await ProductsController.update(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));
  
        request.body = { name: 'produto3', quantity: 'string' };
  
        await ProductsController.update(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));

        ProductsService.update.restore();
      });
    });

    describe('B - when request is succesful', () => {
      request.body = { name: 'edited name', quantity: 12 };
  
      beforeEach(async () => {
        Sinon.stub(ProductsService, 'update')
          .resolves({
            id: 2,
            name: 'edited name',
            quantity: '12',
          });
      });
  
      afterEach(async () => {
        ProductsService.update.restore();
      });
  
      it('returns code 200', async () => {
        await ProductsController.update(request, response);
  
        expect(response.status.calledWith(200)).to.be.eq(true);
      });
  
      it('returns the updated product object', async () => {
        await ProductsController.update(request, response);
  
        expect(response.json.calledWith({
          id: 2,
          name: 'edited name',
          quantity: '12',
        })).to.be.eq(true);
      });
    });
  });

  describe('5 - Send /DELETE request to products controller to remove product by id', () => {
    describe('A - when product is not found', () => {
      request.params = { id: 777 };

      beforeEach(async () => {
        Sinon.stub(ProductsService, 'removeById').
          resolves({
            error: {
              code: 404,
              message: 'Product not found',
            },
          });
      });

      afterEach(async () => {
        ProductsService.removeById.restore();
      });

      it('returns code 404', async () => {
        await ProductsController.removeById(request, response);

        expect(response.status.calledWith(404)).to.be.eq(true);
      });

      it('returns a message "Product not found"', async () => {
        await ProductsController.removeById(request, response);

        expect(response.json.calledWith({ message: 'Product not found' })).to.be.eq(true);
      });
    });

    describe('B - when request is succesful', () => {
      request.params = { id: 1 };

      beforeEach(async () => {
        Sinon.stub(ProductsService, 'removeById').
          resolves({
            id: 1,
            name: 'produto',
            quantity: '10',
          });
      });

      afterEach(async () => {
        ProductsService.removeById.restore();
      });

      it('returns code 200', async () => {
        await ProductsController.removeById(request, response);

        expect(response.status.calledWith(200)).to.be.eq(true);
      });

      it('returns the product', async () => {
        await ProductsController.removeById(request, response);

        expect(response.json.calledWith({
          id: 1,
          name: 'produto',
          quantity: '10',
        })).to.be.eq(true);
      })
    });
  });
});

describe('--SALES CONTROLLER UNIT TESTS--', () => {
  describe('1 - Send /POST request to sales controller to insert new sale', () => {
    describe('A - when request has invalid data', () => {
      it('no product_id returns code 400 and message \'"product_id" is required', async () => {
        Sinon.stub(SalesService, 'create')
          .resolves({
            error: {
              code: 400,
              message: '"product_id" is required',
            },
          });

        request.body = [{ product_id: null, quantity: 10 }];
  
        await SalesController.create(request, response);
  
        expect(response.status.calledWith(400)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"product_id" is required' }));

        SalesService.create.restore();
      });
      it('no quantity returns code 400 and message \'"quantity" is required\'', async () => {
        Sinon.stub(SalesService, 'create')
        .resolves({
          error: {
            code: 400,
            message: '"quantity" is required',
          },
        });
        request.body = [{ product_id: 1, quantity: null }];
  
        await SalesController.create(request, response);
  
        expect(response.status.calledWith(400)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" is required' }));

        SalesService.create.restore();
      });
  
      it('invalid quantity returns code 422 and message \'"quantity" must be a number larger than or equal to 1\'', async () => {
        Sinon.stub(SalesService, 'create')
        .resolves({
          error: {
            code: 422,
            message: '"quantity" must be a number larger than or equal to 1',
          },
        });
        request.body = [{ product_id: 1, quantity: 0 }];
  
        await SalesController.create(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));
  
        request.body = [{ product_id: 1, quantity: -1 }];
  
        await SalesController.create(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));
  
        request.body = [{ product_id: 1, quantity: 'string' }];
  
        await SalesController.create(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));

        SalesService.create.restore();
      });
    });

    describe('B - when request is succesful', () => {
      request.body = [{ product_id: 1, quantity: 1 }];

      beforeEach(async () => {
        Sinon.stub(SalesService, 'create')
          .resolves({
            id: 1,
            itemsSold: [{
              product_id: 1,
              quantity: 1,
            }]
          });
      });
  
      afterEach(async () => {
        SalesService.create.restore();
      });

      it('returns code 201', async () => {
        await SalesController.create(request, response);
  
        expect(response.status.calledWith(201)).to.be.eq(true);
      });
  
      it('returns the sale information', async () => {
        await SalesController.create(request, response);
  
        expect(response.json.calledWith({
          id: 1,
          itemsSold: [{
            product_id: 1,
            quantity: 1,
          }],
        })).to.be.eq(true);
      });
    });
  });

  describe('2 - Send /GET request to sales controller to get all sales', () => {
    describe('A - when request yields no sales', () => {
      beforeEach(async () => {
        Sinon.stub(SalesService, 'getAll')
          .resolves([]);
      });

      afterEach(async () => {
        SalesService.getAll.restore();
      });
      
      it('returns code 200', async () => {
        await SalesController.getAll(request, response);

        expect(response.status.calledWith(200)).to.be.eq(true);
      });

      it('returns an empty list', async () => {
        await SalesController.getAll(request, response);

        expect(response.json.calledWith([])).to.be.eq(true);
      });
    });

    describe('B - when request is succesful', () => {
      const RETURN_LIST = [
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
      ];

      beforeEach(async () => {
        Sinon.stub(SalesService, 'getAll')
          .resolves(RETURN_LIST);
      });

      afterEach(async () => {
        SalesService.getAll.restore();
      });

      it('returns code 200', async () => {
        await SalesController.getAll(request, response);

        expect(response.status.calledWith(200)).to.be.eq(true);
      });

      it('returns a list of products', async () => {
        await SalesController.getAll(request, response);

        expect(response.json.calledWith(RETURN_LIST)).to.be.eq(true);
      });
    });
  });

  describe('3 - Send /GET request to sales controller to find sales by id', () => {
    describe('A - when product is not found', () => {
      request.params = { id: 777 };

      beforeEach(async () => {
        Sinon.stub(SalesService, 'findById').
          resolves({
            error: {
              code: 404,
              message: 'Sale not found',
            },
          });
      });

      afterEach(async () => {
        SalesService.findById.restore();
      });

      it('returns code 404', async () => {
        await SalesController.findById(request, response);

        expect(response.status.calledWith(404)).to.be.eq(true);
      });

      it('returns a message "Sale not found"', async () => {
        await SalesController.findById(request, response);

        expect(response.json.calledWith({ message: 'Sale not found' })).to.be.eq(true);
      });
    });

    describe('B - when request is succesful', () => {
      request.params = { id: 1 };

      beforeEach(async () => {
        Sinon.stub(SalesService, 'findById').
          resolves(  [
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
        SalesService.findById.restore();
      });

      it('returns code 200', async () => {
        await SalesController.findById(request, response);

        expect(response.status.calledWith(200)).to.be.eq(true);
      });

      it('returns a list of products', async () => {
        await SalesController.findById(request, response);

        expect(response.json.calledWith([
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
        ])).to.be.eq(true);
      })
    });
  });

  describe('4 - Send /PUT request to sales controller to update a sale by id', () => {
    request.params = { id: 1 };

    describe('A - when request has invalid data', () => {
      it('no product_id returns code 400 and message \'"product_id" is required\'', async () => {
        Sinon.stub(SalesService, 'update')
          .resolves({
            error: {
              code: 400,
              message: '"product_id" is required',
            },
          });

        request.body = [{ product_id: null, quantity: 10 }];
  
        await SalesController.update(request, response);
  
        expect(response.status.calledWith(400)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"product_id" is required' }));

        SalesService.update.restore();
      });

      it('when product does no exist returns code 422 and message \'Product not found\'', async () => {
        Sinon.stub(SalesService, 'update')
          .resolves({
            error: {
              code: 422,
              message: 'Product not found',
            },
          });

        request.body = [{ name: 'produto', quantity: 10 }];
  
        await SalesController.update(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: 'Product not found' }));

        SalesService.update.restore();
      });

      it('no quantity returns code 400 and message \'"quantity" is required\'', async () => {
        Sinon.stub(SalesService, 'update')
          .resolves({
            error: {
              code: 400,
              message: '"quantity" is required',
            },
          });

        request.body = [{ product_id: 1, quantity: null }];
  
        await SalesController.update(request, response);
  
        expect(response.status.calledWith(400)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" is required' }));

        SalesService.update.restore();
      });

      it('invalid quantity returns code 422 and message \'"quantity" must be larger than or equal to 1\'', async () => {
        Sinon.stub(SalesService, 'update')
        .resolves({
          error: {
            code: 422,
            message: '"quantity" must be a number larger than or equal to 1',
          },
        });
        request.body = [{ name: 'produto3', quantity: -1 }];
  
        await SalesController.update(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));
  
        request.body = [{ name: 'produto3', quantity: 0 }];
  
        await SalesController.update(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));
  
        request.body = [{ name: 'produto3', quantity: 'string' }];
  
        await SalesController.update(request, response);
  
        expect(response.status.calledWith(422)).to.be.eq(true);
        expect(response.json.calledWith({ message: '"quantity" must be a number larger than or equal to 1' }));

        SalesService.update.restore();
      });
    });

    describe('B - when request is succesful', () => {
      request.body = { product_id: 1, quantity: 12 };
  
      beforeEach(async () => {
        Sinon.stub(SalesService, 'update')
          .resolves({
            saleId: 1,
            itemUpdated: {
              productId: 1,
              quantity: 12,
            },
          });
      });
  
      afterEach(async () => {
        SalesService.update.restore();
      });
  
      it('returns code 200', async () => {
        await SalesController.update(request, response);
  
        expect(response.status.calledWith(200)).to.be.eq(true);
      });
  
      it('returns the updated sale object', async () => {
        await SalesController.update(request, response);
  
        expect(response.json.calledWith({
          saleId: 1,
          itemUpdated: {
            productId: 1,
            quantity: 12,
          },
        })).to.be.eq(true);
      });
    });
  });

  describe('5 - Send /DELETE request to sales controller to remove sale by id', () => {
    describe('A - when sale is not found', () => {
      request.params = { id: 999 };

      beforeEach(async () => {
        Sinon.stub(SalesService, 'removeById')
          .resolves({
            error: {
              code: 404,
              message: 'Sale not found',
            },
          });
      });

      afterEach(async () => {
        SalesService.removeById.restore();
      });

      it('returns code 404', async () => {
        await SalesController.removeById(request, response);

        expect(response.status.calledWith(404)).to.be.eq(true);
      });

      it('returns a message "Sale not found"', async () => {
        await SalesController.removeById(request, response);

        expect(response.json.calledWith({ message: 'Sale not found' })).to.be.eq(true);
      });


    });

    describe('B - when request is succesful', () => {
      request.params = { id: 1 };

      beforeEach(async () => {
        Sinon.stub(SalesService, 'removeById').
          resolves([
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
        SalesService.removeById.restore();
      });

      it('returns code 200', async () => {
        await SalesController.removeById(request, response);

        expect(response.status.calledWith(200)).to.be.eq(true);
      });

      it('returns the product', async () => {
        await SalesController.removeById(request, response);

        expect(response.json.calledWith([
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
        ])).to.be.eq(true);
      });
    });
  });
});
