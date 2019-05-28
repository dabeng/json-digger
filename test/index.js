import { should, expect } from 'chai';
import JSONDigger from '../src/index';
should();

describe('JSONDigger', () => {

  let datasource, digger;
  const idErrMsg = 'Parameter id is invalid.';
  const dataErrMsg = 'Parameter data is invalid.';

  beforeEach(() => {
    datasource = {
      pk: '1',
      name: 'Lao Lao',
      title: 'general manager',
      isShareholder: true,
      birthYear: 1940,
      inferiors: [
        { pk: '2', name: 'Bo Miao', title: 'department manager', isShareholder: true, birthYear: 1960,
          inferiors: [
            { pk: '10', name: 'Ren Wu', title: 'principle engineer', isShareholder: false, birthYear: 1960 }
          ]
        },
        {
          pk: '3',
          name: 'Su Miao',
          title: 'department manager',
          isShareholder: true,
          birthYear: 1961,
          inferiors: [
            { pk: '4', name: 'Tie Hua', title: 'principle engineer', isShareholder: false, birthYear: 1961 },
            {
              pk: '5',
              name: 'Hei Hei',
              title: 'senior engineer',
              isShareholder: false,
              birthYear: 1980,
              inferiors: [
                { pk: '6', name: 'Pang Pang', title: 'UE engineer', isShareholder: false, birthYear: 1984 },
                { pk: '7', name: 'Xiang Xiang', title: 'QA engineer', isShareholder: false, birthYear: 2014 }
              ]
            }
          ]
        },
        { pk: '8', name: 'Hong Miao', title: 'department manager', isShareholder: true, birthYear: 1962 },
        { pk: '9', name: 'Chun Miao', title: 'department manager', isShareholder: true, birthYear: 1963 }
      ]
    };
    digger = new JSONDigger(datasource, 'pk', 'inferiors');
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
      it('should throw an error', async () => {
        try {
          await digger.findNodeById('11');
        } catch (err) {
          err.message.should.equal('The node doesn\'t exist.');
        }
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error when id is invalid', async () => {
        try {
          await digger.findNodeById(null);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.findNodeById(undefined);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.findNodeById('');
        } catch (err) {
          err.message.should.equal(idErrMsg);
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
      const errMessage = 'The nodes don\'t exist.';

      it('should throw an error', async () => {
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

    context('when users don\'t provide valid parameters', () => {
      const errMessage = 'Parameter conditions are invalid.';

      it('should throw an error when conditions are invalid', async () => {
        try {
          await digger.findNodes(null);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodes(undefined);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findNodes('');
        } catch (err) {
          err.message.should.equal(errMessage);
        }
      });
    });

  });

  describe('#findParent()', () => {

    context('when the parent node exists', () => {
      it('should return node "Su Miao" when id is "4"', async () => {
        const node = await digger.findParent('4');
        node.name.should.equal('Su Miao');
      });
      it('should return node "Hei Hei" when id is "7"', async () => {
        const node = await digger.findParent('7');
        node.name.should.equal('Hei Hei');
      });
    });

    context('when the parent node doesn\'t exist', () => {
      const errMessage = 'The parent node doesn\'t exist.';

      it('should throw an error', async () => {
        try {
          await digger.findParent('1');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.findParent('11');
        } catch (err) {
          err.message.should.equal(errMessage);
        }
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error when id is invalid', async () => {
        try {
          await digger.findParent(null);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.findParent(undefined);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.findParent('');
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }
      });
    });

  });

  describe('#findSiblings()', () => {

    context('when the sibling nodes exist', () => {
      it('should return 3 sibling nodes when searching bomiao\'s siblings', async () => {
        const siblings = await digger.findSiblings('2');
        siblings.length.should.equal(3);
        siblings[siblings.length - 1].name.should.equal('Chun Miao');
      });

      it('should return 1 sibling nodes when searching panpang\'s siblings', async () => {
        const siblings = await digger.findSiblings('6');
        siblings.length.should.equal(1);
        siblings[siblings.length - 1].name.should.equal('Xiang Xiang');
      });

      it('should return 0 sibling nodes when searching renwu\'s siblings', async () => {
        const siblings = await digger.findSiblings('10');
        siblings.length.should.equal(1);
      });

    });

    context('when the sibling nodes don\'t exist', () => {
      it('should throw an error', async () => {
        try {
          await digger.findSiblings('1');
        } catch (err) {
          err.message.should.equal('The sibling nodes don\'t exist.');
        }
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error when id is invalid', async () => {
        try {
          await digger.findSiblings(null);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.findSiblings(undefined);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.findSiblings('');
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }
      });
    });

  });

  describe('#findAncestors()', () => {

    context('when the ancestor nodes exist', () => {
      it('should return 1 ancestor nodes when searching sumiao\'s ancestors', async () => {
        const ancestors = await digger.findAncestors('3');
        ancestors.length.should.equal(1);
        ancestors[0].name.should.equal('Lao Lao');
      });

      it('should return 2 ancestor nodes when searching heihei\'s ancestors', async () => {
        const ancestors = await digger.findAncestors('5');
        ancestors.length.should.equal(2);
        ancestors[0].name.should.equal('Su Miao');
        ancestors[1].name.should.equal('Lao Lao');
      });

      it('should return 3 ancestor nodes when searching xiangxiang\'s ancestors', async () => {
        const ancestors = await digger.findAncestors('7');
        ancestors.length.should.equal(3);
        ancestors[0].name.should.equal('Hei Hei');
        ancestors[1].name.should.equal('Su Miao');
        ancestors[2].name.should.equal('Lao Lao');
      });
    });

    context('when the ancestor nodes don\'t exist', () => {
      it('should throw an error', async () => {
        try {
          await digger.findAncestors('1');
        } catch (err) {
          err.message.should.equal('The ancestor nodes don\'t exist.');
        }
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error when id is invalid', async () => {
        try {
          await digger.findAncestors(null);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.findAncestors(undefined);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.findAncestors('');
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }
      });
    });

  });

  describe('#addChildren()', () => {

    context('when adding single node', () => {
      it('could add child node to root node', async () => {
        await digger.addChildren('1', { pk: '11', name: 'Yu Jie' });
        datasource.inferiors.some(item => item.name === 'Yu Jie').should.be.true;
      });

      it('could add child node to middle level node', async () => {
        await digger.addChildren('5', { pk: '11', name: 'Dan Dan' });
        datasource.inferiors[1].inferiors[1].inferiors.some(item => item.name === 'Dan Dan').should.be.true;
      });

      it('could add child node to leaf node', async () => {
        await digger.addChildren('10', { pk: '11', name: 'Fei Xuan' });
        datasource.inferiors[0].inferiors[0].inferiors.some(item => item.name === 'Fei Xuan').should.be.true;
      });
    });

    context('when adding multiple nodes', () => {
      it('could add child nodes to root node', async () => {
        await digger.addChildren('1', [{ pk: '11', name: 'Yu Jie' }, { pk: '12', name: 'Yu Li' }]);
        datasource.inferiors.some(item => item.name === 'Yu Jie').should.be.true;
        datasource.inferiors.some(item => item.name === 'Yu Li').should.be.true;
      });

      it('could add child nodes to middle level node', async () => {
        await digger.addChildren('5', [{ pk: '11', name: 'Dan Dan' }, { pk: '12', name: 'Er Dan' }]);
        datasource.inferiors[1].inferiors[1].inferiors.some(item => item.name === 'Dan Dan').should.be.true;
        datasource.inferiors[1].inferiors[1].inferiors.some(item => item.name === 'Er Dan').should.be.true;
      });

      it('could add child nodes to leaf node', async () => {
        await digger.addChildren('10', [{ pk: '11', name: 'Fei Xuan' }, { pk: '12', name: 'Er Xuan' }]);
        datasource.inferiors[0].inferiors[0].inferiors.some(item => item.name === 'Fei Xuan').should.be.true;
        datasource.inferiors[0].inferiors[0].inferiors.some(item => item.name === 'Er Xuan').should.be.true;
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error when id is invalid', async () => {
        try {
          await digger.addChildren(null);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.addChildren(undefined);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.addChildren('');
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }
      });

      it('should throw an error when data is invalid', async () => {
        try {
          await digger.addChildren('1');
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', 1);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', 'xx');
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', null);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', undefined);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', {});
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', []);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', [1]);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', ['xx']);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', [null]);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', [undefined]);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addChildren('1', [{}]);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }
      });

      it('should throw an error when parent node can\'t be found', async () => {
        try {
          await digger.addChildren('11', { id: '11', name: 'Yu Jie' });
        } catch (err) {
          err.message.should.equal('Failed to add child nodes.');
        }
      });
    });
  });

  describe('#addSiblings()', () => {

    context('when adding single node', () => {
      it('could add sibling node to middle level node', async () => {
        await digger.addSiblings('5', { pk: '11', name: 'Dan Dan' });
        datasource.inferiors[1].inferiors.some(item => item.name === 'Dan Dan').should.be.true;
      });

      it('could add sibling node to leaf node', async () => {
        await digger.addSiblings('10', { pk: '11', name: 'Fei Xuan' });
        datasource.inferiors[0].inferiors.some(item => item.name === 'Fei Xuan').should.be.true;
      });
    });

    context('when adding multiple nodes', () => {
      it('could add sibling nodes to middle level node', async () => {
        await digger.addSiblings('5', [{ pk: '11', name: 'Dan Dan' }, { pk: '12', name: 'Er Dan' }]);
        datasource.inferiors[1].inferiors.some(item => item.name === 'Dan Dan').should.be.true;
        datasource.inferiors[1].inferiors.some(item => item.name === 'Er Dan').should.be.true;
      });

      it('could add sibling nodes to leaf node', async () => {
        await digger.addSiblings('10', [{ pk: '11', name: 'Fei Xuan' }, { pk: '12', name: 'Er Xuan' }]);
        datasource.inferiors[0].inferiors.some(item => item.name === 'Fei Xuan').should.be.true;
        datasource.inferiors[0].inferiors.some(item => item.name === 'Er Xuan').should.be.true;
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error when id is invalid', async () => {
        try {
          await digger.addSiblings(null);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.addSiblings(undefined);
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }

        try {
          await digger.addSiblings('');
        } catch (err) {
          err.message.should.equal(idErrMsg);
        }
      });

      it('should throw an error when data is invalid', async () => {
        try {
          await digger.addSiblings('1');
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', 1);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', 'xx');
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', null);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', undefined);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', {});
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', []);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', [1]);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', ['xx']);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', [null]);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', [undefined]);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.addSiblings('1', [{}]);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }
      });
    });
  });

  describe('#addRoot()', () => {

    context('when adding root node', () => {
      it('could add root node with new properties', () => {
        digger.addRoot({ pk: '11', name: 'Dan Dan' });
        datasource.pk.should.equal('11');
        datasource.name.should.equal('Dan Dan');
        datasource.inferiors.length.should.equal(1);
        expect(datasource.title).to.be.undefined;
        expect(datasource.isShareholder).to.be.undefined;
        expect(datasource.birthYear).to.be.undefined;
      });

      it('could add root node without children property', () => {
        digger.addRoot({ pk: '11', name: 'Dan Dan', 'inferiors': [{ pk: '12'}, { pk: '13'}] });
        datasource.inferiors.length.should.equal(1);
        datasource.inferiors[0].name.should.equal('Lao Lao');
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error', () => {
        try {
          digger.addRoot(null);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          digger.addRoot(undefined);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          digger.addRoot('');
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }
      });
    });
  });

  describe('#updateNode()', () => {

    context('when updating root node', () => {
      it('could update node with new properties', async () => {
        await digger.updateNode({ pk: '1', name: 'Lao Ye' });
        datasource.name.should.equal('Lao Ye');
        datasource.title.should.equal('general manager');
        datasource.inferiors.length.should.equal(4);
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error', async () => {
        try {
          await digger.updateNode(null);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.updateNode(undefined);
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.updateNode('');
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.updateNode({});
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }

        try {
          await digger.updateNode({ 'name': 'Lao Ye' });
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }
      });
    });
  });

  describe('#updateNodes()', () => {

    context('when updating root node', () => {
      it('could update node with new properties', async () => {
        await digger.updateNodes(['1'], { name: 'Lao Ye' });
        datasource.name.should.equal('Lao Ye');
        datasource.title.should.equal('general manager');
        datasource.inferiors.length.should.equal(4);
      });
    });

    context('when updating leaf nodes', () => {
      it('could update multiple leaf nodes with new properties', async () => {
        await digger.updateNodes(['6', '7', '10'], { title: 'senior engineer' });
        const node6 = await digger.findNodeById('6');
        node6.title.should.equal('senior engineer');
        const node7 = await digger.findNodeById('7');
        node7.title.should.equal('senior engineer');
        const node10 = await digger.findNodeById('10');
        node10.title.should.equal('senior engineer');
      });
    });

    context('when updating common nodes', () => {
      it('could update multiple common nodes with new properties', async () => {
        await digger.updateNodes(['4', '5'], { title: 'chief scientist' });
        const node4 = await digger.findNodeById('4');
        node4.title.should.equal('chief scientist');
        const node5 = await digger.findNodeById('5');
        node5.title.should.equal('chief scientist');

      });
    });

    context('when users don\'t provide valid parameters', () => {
      const inputParamErrMsg = 'Input parameter is invalid.';
      const errMessage = 'Failed to remove nodes.';
      const dataErrMsg = 'Parameter data is invalid.';

      it('should throw an error', async () => {
        try {
          await digger.updateNodes(null);
        } catch (err) {
          err.message.should.equal(inputParamErrMsg);
        }

        try {
          await digger.updateNodes(undefined);
        } catch (err) {
          err.message.should.equal(inputParamErrMsg);
        }

        try {
          await digger.updateNodes('');
        } catch (err) {
          err.message.should.equal(inputParamErrMsg);
        }

        try {
          await digger.updateNodes(['1']);
        } catch (err) {
          err.message.should.equal(inputParamErrMsg);
        }

        try {
          await digger.updateNodes(['1'], null);
        } catch (err) {
          err.message.should.equal(inputParamErrMsg);
        }

        try {
          await digger.updateNodes(['1'], undefined);
        } catch (err) {
          err.message.should.equal(inputParamErrMsg);
        }

        try {
          await digger.updateNodes(['1'], {});
        } catch (err) {
          err.message.should.equal(dataErrMsg);
        }
      });

    });

  });

  describe('#removeNodes()', () => {

    context('when removing single node', () => {
      it('could remove middle level node', async () => {
        await digger.removeNodes('4');
        datasource.inferiors[1].inferiors.length.should.equal(1);
      });

      it('could remove leaf node', async () => {
        await digger.removeNodes('7');
        datasource.inferiors[1].inferiors[1].inferiors.length.should.equal(1);
      });

      it('could not remove root node', async () => {
        try {
          await digger.removeNodes('1');
        } catch (err) {
          err.message.should.equal('Failed to remove nodes.');
        }
      });
    });

    context('when removing multiple nodes', () => {
      it('could remove nodes which are not related', async () => {
        await digger.removeNodes(['4', '7']);
        datasource.inferiors[1].inferiors.length.should.equal(1);
        datasource.inferiors[1].inferiors[0].inferiors.length.should.equal(1);
      });

      it('could remove nodes which are peer nodes', async () => {
        await digger.removeNodes(['2', '3']);
        datasource.inferiors.length.should.equal(2);
      });
    });

    context('when removing nodes based on conditions', () => {
      it('could remove nodes which are under the same query conditions', async () => {
        await digger.removeNodes({ title: 'principle engineer' });
        datasource.inferiors[0].inferiors.length.should.equal(0);
        datasource.inferiors[1].inferiors.length.should.equal(1);
      });

      it('could remove one node with id query conditions', async () => {
        await digger.removeNodes({ pk: '5' });
        datasource.inferiors[1].inferiors.length.should.equal(1);
      });
    });

    context('when users don\'t provide valid parameters', () => {
      const inputParamErrMsg = 'Input parameter is invalid.';
      const errMessage = 'Failed to remove nodes.';

      it('should throw an error', async () => {
        try {
          await digger.removeNodes(null);
        } catch (err) {
          err.message.should.equal(inputParamErrMsg);
        }

        try {
          await digger.removeNodes(undefined);
        } catch (err) {
          err.message.should.equal(inputParamErrMsg);
        }

        try {
          await digger.removeNodes('');
        } catch (err) {
          err.message.should.equal(inputParamErrMsg);
        }

        try {
          await digger.removeNodes({});
        } catch (err) {
          err.message.should.equal(inputParamErrMsg);
        }

        try {
          await digger.removeNodes('1');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.removeNodes('11');
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.removeNodes(['11']);
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.removeNodes({ pk: '11' });
        } catch (err) {
          err.message.should.equal(errMessage);
        }

        try {
          await digger.removeNodes({ 'name': 'Lao Ye' });
        } catch (err) {
          err.message.should.equal(errMessage);
        }
      });
    });
  });

});