const Sinon = require('sinon');
const { expect } = require('chai');

const connection = require('../../models/connection');
const ProductsModel = require('../../models/productsModel');
const SalesModel = require('../../models/salesModel');
const SalesProductsModel = require('../../models/salesProductsModel');

const VALID_ID = 1;
const INVALID_ID = 9999;

describe('--PRODUCTS MODEL UNIT TESTS--', () => {
  describe('1 - Insert new product into DB', () => {
    const sampleRequest = {
      name: 'produto',
      quantity: 10,
    };
  
    describe('A - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([{ insertId: 1 }]);
      });
  
      afterEach(async () => {
        connection.execute.restore();
      });
  
      const { name, quantity } = sampleRequest;
  
      it('returns an object', async () => {
        const response = await ProductsModel.create(name, quantity);
  
        expect(response).to.be.a('object');
      });
  
      it('contains keys { id, name, quantity }', async () => {
        const response = await ProductsModel.create(name, quantity);
  
        expect(response).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });
  
  describe('2 - Find product by name in DB', () => {
    const anyName = 'any name';
  
    describe('A - when product is not in DB', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[]]);
      });
  
      afterEach(async () => {
        connection.execute.restore();
      });
  
      it('returns null', async () => {
        const response = await ProductsModel.findByName(anyName);
  
        expect(response).to.be.null;
      });
    });
  
    describe('B - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[{ id: 1, name: 'produto', quantity: '10' }]]);
      });
  
      afterEach(async () => {
        connection.execute.restore();
      });
  
      it('returns an object', async () => {
        const result = await ProductsModel.findByName(anyName);
  
        expect(result).to.be.a('object');
      });
      
      it('contains the keys { id, name, quantity }', async() => {
        const result = await ProductsModel.findByName(anyName);
  
        expect(result).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });

  describe('3 - Get all products from DB', () => {
    describe('A - when DB is empty', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns an array', async () => {
        const products = await ProductsModel.getAll();

        expect(products).to.be.a('array');
      });

      it('is empty', async () => {
        const products = await ProductsModel.getAll();

        expect(products.length).to.be.eq(0);
      });
    });

    describe('B - when there are products in DB', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[{
            "id": 1,
            "name": "produto A",
            "quantity": 10
          },
          {
            "id": 2,
            "name": "produto B",
            "quantity": 20
          }]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns a list of products', async () => {
        const products = await ProductsModel.getAll();
        const productSample = products[0];

        expect(products.length).to.be.not.eq(0);
        expect(productSample).to.be.a('object');
        expect(productSample).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });

  describe('4 - Find product by id in DB', () => {
    describe('A - when id is not found', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns null', async () => {
        const product = await ProductsModel.findById(INVALID_ID);

        expect(product).to.be.null;
      });
    });

    describe('B - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[{
            "id": 1,
            "name": "produto A",
            "quantity": 10
          }]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns an object', async () => {
        const product = await ProductsModel.findById(VALID_ID);

        expect(product).to.be.a('object');
      });

      it('contains all keys { id, name, quantity }', async () => {
        const product = await ProductsModel.findById(VALID_ID)

        expect(product).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });

  describe('5 - Update product by id in DB', () => {
    describe('A - when request is succesful', () => {
      const VALID_ID = 1;
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[{
            "affectedRows": 1,
          }]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns an object', async () => {
        const product = await ProductsModel.update(VALID_ID);

        expect(product).to.be.a('object');
      });

      it('contains all keys { id, name, quantity }', async () => {
        const product = await ProductsModel.update(VALID_ID)

        expect(product).to.have.all.keys('id', 'name', 'quantity');
      });
    });
  });

  describe('6 - Delete product from DB', () => {
    describe('A - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[{
            "id": 1,
            "name": "produto deletado",
            "quantity": 12
          }]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns true', async () => {
        const deletedProduct = await ProductsModel.removeById(VALID_ID);

        expect(deletedProduct).to.be.eq(true);
      });
    });
  })
});

describe('--SALES MODEL UNIT TESTS--', () => {
  describe('1 - Insert new sale into DB', () => {
    const productId = 1;
    const quantity = 1;
  
    describe('A - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([{ insertId: 1 }]);
      });
  
      afterEach(async () => {
        connection.execute.restore();
      });
  
      it('returns an object', async () => {
        const response = await SalesModel.create(productId, quantity);
  
        expect(response).to.be.a('object');
      });
  
      it('contains the id', async () => {
        const response = await SalesModel.create(productId, quantity);
  
        expect(response).to.have.property('id');
      });
    });
  });

  describe('2 - Get all sales from DB', () => {
    describe('A - when DB is empty', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns an array', async () => {
        const sales = await SalesModel.getAll();

        expect(sales).to.be.a('array');
      });

      it('is empty', async () => {
        const sales = await SalesModel.getAll();

        expect(sales.length).to.be.eq(0);
      });
    });

    describe('B - when there are products in DB', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([  [
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
          ]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns a list of sales', async () => {
        const sales = await SalesModel.getAll();
        const saleSample =sales[0];

        expect(sales.length).to.be.not.eq(0);
        expect(saleSample).to.be.a('object');
        expect(saleSample).to.have.all.keys('saleId', 'date', 'product_id', 'quantity');
      });
    });
  });

  describe('3 - Find sale by id in DB', () => {
    const VALID_ID = 1;
    const INVALID_ID = 999;

    describe('A - when id is not found', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns null', async () => {
        const sale = await SalesModel.findById(INVALID_ID);

        expect(sale).to.be.null;
      });
    });

    describe('B - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[
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
        ]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns an array', async () => {
        const sales = await SalesModel.findById(VALID_ID);

        expect(sales).to.be.a('array');
      });

      it('contains a list of sales', async () => {
        const sales = await SalesModel.findById(VALID_ID)

        const sampleSale = sales[0]

        expect(sampleSale).to.have.all.keys('date', 'product_id', 'quantity');
      });
    });
  });

  describe('4 - Delete sale from DB', () => {
    const VALID_ID = 1;

    describe('A - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[{
            "id": 1,
            "date": "2021-09-09T04:54:29.000Z",
          }]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns true', async () => {
        const deletedSale = await SalesModel.removeById(VALID_ID);

        expect(deletedSale).to.be.eq(true);
      });
    });
  })
});

describe('--SALESPRODUCTS MODEL UNIT TESTS--', () => {
  describe('1 - Insert new pair sales_products', () => {
    const [salesId, productId, quantity] = [1, 1, 1];

    describe('A - when request is succesful', () => {
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([{ insertId: 1 }]);
      });
  
      afterEach(async () => {
        connection.execute.restore();
      });
  
      it('returns an object', async () => {
        const response = await SalesProductsModel.create(salesId, productId, quantity);

        expect(response).to.be.a('object');
      });

      it('contains the keys { salesId, productId, quantity }', async () => {
        const response = await SalesProductsModel.create(salesId, productId, quantity);

        expect(response).to.have.all.keys('salesId', 'productId', 'quantity');
      });
    });
  });

  describe('2 - Update pair sale_product by sale_id in DB', () => {
    describe('A - when request is succesful', () => {
      const VALID_ID = 1;
      beforeEach(async () => {
        Sinon.stub(connection, 'execute')
          .resolves([[{
            "affectedRows": 1,
          }]]); 
      });

      afterEach(async () => {
        connection.execute.restore();
      });

      it('returns an object', async () => {
        const sale = await SalesProductsModel.update(VALID_ID);

        expect(sale).to.be.a('object');
      });

      it('contains all keys { saleId, itemUpdated }', async () => {
        const sale = await SalesProductsModel.update(VALID_ID)

        expect(sale).to.have.all.keys('saleId', 'itemUpdated');
      });

      it('contains the updated item', async () => {
        const { itemUpdated } = await SalesProductsModel.update(VALID_ID)

        expect(itemUpdated[0]).to.have.all.keys('productId', 'quantity');
      });
    });
  });

  // describe('3 - Delete pair sale_product from DB', () => {
  //   const VALID_ID = 1;

  //   describe('A - when request is succesful', () => {
  //     beforeEach(async () => {
  //       Sinon.stub(connection, 'execute')
  //         .resolves([[{
  //           sale_id: 1,
  //           product_id: 2,
  //           quantity: 10,
  //         }]]); 
  //     });

  //     afterEach(async () => {
  //       connection.execute.restore();
  //     });

  //     it('returns true', async () => {
  //       const deletedSale = await SalesProductsModel.removeById(VALID_ID);

  //       expect(deletedSale).to.be.eq(true);
  //     });
  //   });
  // });
});
