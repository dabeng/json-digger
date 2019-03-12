import { should } from 'chai';
import JSONDigger from '../src/index';
should();

describe('JSONDigger', () => {

  let datasource, digger, errMessage;

  before(() => {
    errMessage = 'One or more input parameters are invalid';
  });

  beforeEach(() => {
    datasource = {
      id: '1',
      name: 'Lao Lao',
      title: 'general manager',
      children: [
        { id: '2', name: 'Bo Miao', title: 'department manager',
          children: [
            { id: '10', name: 'Ren Wu', title: 'senior QA' }
          ]
        },
        {
          id: '3',
          name: 'Su Miao',
          title: 'department manager',
          children: [
            { id: '4', name: 'Tie Hua', title: 'senior engineer' },
            {
              id: '5',
              name: 'Hei Hei',
              title: 'senior engineer',
              children: [
                { id: '6', name: 'Pang Pang', title: 'engineer' },
                { id: '7', name: 'Xiang Xiang', title: 'UE engineer' }
              ]
            }
          ]
        },
        { id: '8', name: 'Hong Miao', title: 'department manager' },
        { id: '9', name: 'Chun Miao', title: 'department manager' }
      ]
    };
    digger = new JSONDigger('id', 'children');
  });

  describe('#findNodeById()', () => {

    context('when the node with given id exist', () => {
      it('should return node "Lao Lao" when id is "1"', async () => {
        const node = await digger.findNodeById(datasource, '1');
        node.name.should.equal('Lao Lao');
      });
      it('should return node "Tie Hua" when id is "4"', async () => {
        const node = await digger.findNodeById(datasource, '4');
        node.name.should.equal('Tie Hua');
      });
      it('should return node "Pang Pang" when id is "6"', async () => {
        const node = await digger.findNodeById(datasource, '6');
        node.name.should.equal('Pang Pang');
      });
    });

    context('when the node with given id doesn\'t exist', () => {
      it('should throw an error with message "the node doesn\'t exist"', async () => {
        try {
          await digger.findNodeById(datasource, '11');
        } catch (err) {
          err.message.should.equal('the node doesn\'t exist');
        }
      });
    });

    context('when users don\'t provide enough and valid parameters', () => {
      it('should throw an error with message "target object is invalid" when providing empty object', async () => {
        try {
          await digger.findNodeById(null, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodeById(undefined, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodeById({}, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodeById(datasource, null);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodeById(datasource, undefined);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodeById(datasource, '');
        } catch (err) {
          err.message.should.equal(errMessage);
        }
      });
    });

  });

  describe('#findParent()', () => {

    context('when the parent node exists', () => {
      it('should return node "Su Miao" when id is "4"', async () => {
        const node = await digger.findParent(datasource, '4');
        node.name.should.equal('Su Miao');
      });
      it('should return node "Hei Hei" when id is "7"', async () => {
        const node = await digger.findParent(datasource, '7');
        node.name.should.equal('Hei Hei');
      });
    });

    context('when the parent node doesn\'t exist', () => {
      it('should throw an error with message "the parent node doesn\'t exist"', async () => {
        try {
          await digger.findParent(datasource, '1');
        } catch (err) {
          err.message.should.equal('the parent node doesn\'t exist');
        }

        try {
          await digger.findParent(datasource, '11');
        } catch (err) {
          err.message.should.equal('the parent node doesn\'t exist');
        }
      });
    });

    context('when users don\'t provide enough and valid parameters', () => {
      it('should throw an error with message "target object is invalid" when providing empty object', async () => {
        try {
          await digger.findParent(null, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findParent(undefined, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findParent({}, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findParent(datasource, null);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findParent(datasource, undefined);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findParent(datasource, '');
        } catch (err) {
          err.message.should.equal(errMessage);
        }
      });
    });

  });

  describe('#findSiblings()', () => {

    context('when the sibling nodes exist', () => {
      it('should return 3 sibling nodes when id is "2"', async () => {
        const siblings = await digger.findSiblings(datasource, '2');
        siblings.length.should.equal(3);
        siblings[siblings.length - 1].name.should.equal('Chun Miao');
      });

      it('should return 1 sibling nodes when id is "6"', async () => {
        const siblings = await digger.findSiblings(datasource, '6');
        siblings.length.should.equal(1);
        siblings[siblings.length - 1].name.should.equal('Xiang Xiang');
      });

      it('should return 0 sibling nodes when id is "10"', async () => {
        const siblings = await digger.findSiblings(datasource, '10');
        siblings.length.should.equal(0);
        // siblings[siblings.length - 1].name.should.equal('Xiang Xiang');
      });

    });

  });

});