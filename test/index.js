import { should } from 'chai';
import JSONDigger from '../src/index';
should();

describe('JSONDigger', () => {

  let datasource, digger;

  before(() => {

  });

  beforeEach(() => {
    datasource = {
      id: '1',
      name: 'Lao Lao',
      title: 'general manager',
      isShareholder: true,
      birthYear: 1940,
      children: [
        { id: '2', name: 'Bo Miao', title: 'department manager', isShareholder: true, birthYear: 1960,
          children: [
            { id: '10', name: 'Ren Wu', title: 'principle engineer', isShareholder: false, birthYear: 1960 }
          ]
        },
        {
          id: '3',
          name: 'Su Miao',
          title: 'department manager',
          isShareholder: true,
          birthYear: 1961,
          children: [
            { id: '4', name: 'Tie Hua', title: 'principle engineer', isShareholder: false, birthYear: 1961 },
            {
              id: '5',
              name: 'Hei Hei',
              title: 'senior engineer',
              isShareholder: false,
              birthYear: 1980,
              children: [
                { id: '6', name: 'Pang Pang', title: 'UE engineer', isShareholder: false, birthYear: 1984 },
                { id: '7', name: 'Xiang Xiang', title: 'QA engineer', isShareholder: false, birthYear: 2014 }
              ]
            }
          ]
        },
        { id: '8', name: 'Hong Miao', title: 'department manager', isShareholder: true, birthYear: 1962 },
        { id: '9', name: 'Chun Miao', title: 'department manager', isShareholder: true, birthYear: 1963 }
      ]
    };
    digger = new JSONDigger(datasource, 'id', 'children');
  });

  describe('#findNodeById()', () => {

    context('when the node with given id exist', () => {
      it('should return node "Lao Lao" when id is "1"', async () => {
        const node = await digger.findNodeById('1');
        node.name.should.equal('Lao Lao');
      });
      it('should return node "Tie Hua" when id is "4"', async () => {
        const node = await digger.findNodeById('4');
        node.name.should.equal('Tie Hua');
      });
      it('should return node "Pang Pang" when id is "6"', async () => {
        const node = await digger.findNodeById('6');
        node.name.should.equal('Pang Pang');
      });
    });

    context('when the node with given id doesn\'t exist', () => {
      it('should throw an error with message "The node doesn\'t exist."', async () => {
        try {
          await digger.findNodeById('11');
        } catch (err) {
          err.message.should.equal('The node doesn\'t exist.');
        }
      });
    });

    context('when users don\'t provide enough and valid parameters', () => {
      it('should throw an error with message "Parameter id is invalid."', async () => {
        try {
          await digger.findNodeById(null);
        } catch (err) {
          err.message.should.equal('Parameter id is invalid.');
        }

        try {
          await digger.findNodeById(undefined);
        } catch (err) {
          err.message.should.equal('Parameter id is invalid.');
        }

        try {
          await digger.findNodeById('');
        } catch (err) {
          err.message.should.equal('Parameter id is invalid.');
        }
      });
    });

  });

  describe('#findNodes()', () => {

    context('when the nodes exist', () => {
      it('should return node xiangxiang with name "Xiang Xiang"', async () => {
        const nodes = await digger.findNodes({'name': 'Xiang Xiang'});
        nodes.length.should.equal(1);
        nodes[0].name.should.equal('Xiang Xiang');
      });

      it('there is only one employee who is born in 1980', async () => {
        const nodes = await digger.findNodes({ 'birthYear': 1980 });
        nodes.length.should.equal(1);
      });

      it('there are 5 engineer nodes', async () => {
        const nodes = await digger.findNodes({ 'title': /engineer/i });
        nodes.length.should.equal(5);
      });

      it('there are 5 shareholder nodes', async () => {
        const nodes = await digger.findNodes({ 'isShareholder': true });
        nodes.length.should.equal(5);
      });

      it('there are 5 non-shareholder nodes', async () => {
        const nodes = await digger.findNodes({ 'isShareholder': false });
        nodes.length.should.equal(5);
      });

      it('there are 5 engineer nodes', async () => {
        const nodes = await digger.findNodes({ 'title': /engineer/i });
        nodes.length.should.equal(5);
      });

      it('there are 2 post-80s engineer nodes', async () => {
        const nodes = await digger.findNodes({ 'title': /engineer/i, 'birthYear': { '>=': 1980, '<': 1990 }});
        nodes.length.should.equal(2);
      });
    });

    context('when the nodes don\'t exist', () => {
      it('should throw an error with message "the nodes don\'t exist"', async () => {
        const errMessage = 'The nodes don\'t exist.';
        try {
          await digger.findNodes({ 'name': 'Dan Dan' });
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodes({ 'birthYear': 2000 });
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodes({ 'title': /intern/i });
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodes({ 'xx': 'xx' });
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodes({ 'xx': 100 });
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodes({ 'xx': true });
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodes({ 'xx': /xx/i });
        } catch (err) {
          err.message.should.equal(errMessage);
        }
      });
    });

    /*context('when users don\'t provide enough and valid parameters', () => {
      it('should throw an error with message "Parameter conditions are invalid."', async () => {
        try {
          await digger.findNodes(null);
        } catch (err) {
          err.message.should.equal('Parameter conditions are invalid.');
        }

        try {
          await digger.findNodes(undefined);
        } catch (err) {
          err.message.should.equal('Parameter conditions are invalid.');
        }

        try {
          await digger.findNodes('');
        } catch (err) {
          err.message.should.equal('Parameter conditions are invalid.');
        }
      });
    });*/

  });

  /*describe('#findParent()', () => {

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
      it('should throw an error with message "One or more input parameters are invalid"', async () => {
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
      it('should return 3 sibling nodes when searching bomiao\'s siblings', async () => {
        const siblings = await digger.findSiblings(datasource, '2');
        siblings.length.should.equal(3);
        siblings[siblings.length - 1].name.should.equal('Chun Miao');
      });

      it('should return 1 sibling nodes when searching panpang\'s siblings', async () => {
        const siblings = await digger.findSiblings(datasource, '6');
        siblings.length.should.equal(1);
        siblings[siblings.length - 1].name.should.equal('Xiang Xiang');
      });

      it('should return 0 sibling nodes when searching renwu\'s siblings', async () => {
        const siblings = await digger.findSiblings(datasource, '10');
        siblings.length.should.equal(0);
      });

    });

    context('when the sibling nodes don\'t exist', () => {
      it('should throw an error with message "the sibling nodes don\'t exist"', async () => {
        try {
          await digger.findSiblings(datasource, '1');
        } catch (err) {
          err.message.should.equal('the sibling nodes don\'t exist');
        }
      });
    });

    context('when users don\'t provide enough and valid parameters', () => {
      it('should throw an error with message "One or more input parameters are invalid"', async () => {
        try {
          await digger.findSiblings(null, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findSiblings(undefined, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findSiblings({}, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findSiblings(datasource, null);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findSiblings(datasource, undefined);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findSiblings(datasource, '');
        } catch (err) {
          err.message.should.equal(errMessage);
        }
      });
    });

  });

  describe('#findAncestors()', () => {

    context('when the ancestor nodes exist', () => {
      it('should return 1 ancestor nodes when searching sumiao\'s ancestors', async () => {
        const ancestors = await digger.findAncestors(datasource, '3');
        ancestors.length.should.equal(1);
        ancestors[0].name.should.equal('Lao Lao');
      });

      it('should return 2 ancestor nodes when searching heihei\'s ancestors', async () => {
        const ancestors = await digger.findAncestors(datasource, '5');
        ancestors.length.should.equal(2);
        ancestors[0].name.should.equal('Su Miao');
        ancestors[1].name.should.equal('Lao Lao');
      });

      it('should return 3 ancestor nodes when searching xiangxiang\'s ancestors', async () => {
        const ancestors = await digger.findAncestors(datasource, '7');
        ancestors.length.should.equal(3);
        ancestors[0].name.should.equal('Hei Hei');
        ancestors[1].name.should.equal('Su Miao');
        ancestors[2].name.should.equal('Lao Lao');
      });
    });

    context('when the ancestor nodes don\'t exist', () => {
      it('should throw an error with message "the ancestor nodes don\'t exist"', async () => {
        try {
          await digger.findAncestors(datasource, '1');
        } catch (err) {
          err.message.should.equal('the ancestor nodes don\'t exist');
        }
      });
    });

    context('when users don\'t provide enough and valid parameters', () => {
      it('should throw an error with message "One or more input parameters are invalid"', async () => {
        try {
          await digger.findAncestors(null, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findAncestors(undefined, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findAncestors({}, '6');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findAncestors(datasource, null);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findAncestors(datasource, undefined);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findAncestors(datasource, '');
        } catch (err) {
          err.message.should.equal(errMessage);
        }
      });
    });

  });*/

});