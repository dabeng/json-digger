const chai = require('chai')
const expect = chai.expect
const should = chai.should();
const JSONDigger = require('../src/index');

describe('JSONDigger', () => {

  let datasource, digger;

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
      it('should return node "Lao Lao" when id is "1"', () => {
        const node = digger.findNodeById('1');
        node.name.should.equal('Lao Lao');
      });
      it('should return node "Tie Hua" when id is "4"', () => {
        const node = digger.findNodeById('4');
        node.name.should.equal('Tie Hua');
      });
      it('should return node "Pang Pang" when id is "6"', () => {
        const node = digger.findNodeById('6');
        node.name.should.equal('Pang Pang');
      });
    });

    context('when the node with given id doesn\'t exist', () => {
      it('should return null',  () => {
        const node = digger.findNodeById('0');
        expect(node).to.be.null;
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should return null', () => {
          const node1 = digger.findNodeById(null);
          expect(node1).to.be.null;

          const node2 = digger.findNodeById(undefined);
          expect(node2).to.be.null;

          const node3 = digger.findNodeById('');
          expect(node3).to.be.null;
      });
    });

  });

  describe('#findOneNode()', () => {

    context('when the node exists', () => {
      it('should return root itself when using root node id to search', () => {
        const node = digger.findOneNode({'pk': '1'});
        node.should.deep.equal(datasource);
      });

      it('there is an employee whose name is "Xiang Xiang"', () => {
        const node = digger.findOneNode({'name': 'Xiang Xiang'});
        node.name.should.equal('Xiang Xiang');
      });

      it('there is an employee who is born in 1980', () => {
        const node = digger.findOneNode({ 'birthYear': 1980 });
        node.birthYear.should.equal(1980);
      });

      it('there is an engineer node', () => {
        const node = digger.findOneNode({ 'title': /engineer/i });
        node.title.should.include('engineer');
      });

      it('there is a shareholder node', () => {
        const node = digger.findOneNode({ 'isShareholder': true });
        node.isShareholder.should.be.true;
      });

      it('there is a non-shareholder nodes', () => {
        const node = digger.findOneNode({ 'isShareholder': false });
        node.isShareholder.should.be.false;
      });

      it('there is a post-80s engineer nodes', () => {
        const node = digger.findOneNode({ 'title': /engineer/i, 'birthYear': { '>=': 1980, '<': 1990 }});
        node.title.should.include('engineer');
        node.birthYear.should.be.within(1980, 1990);
      });
    });

    context('when the node doesn\'t exist', () => {
      it('should return null', () => {
          const node1 = digger.findOneNode({ 'name': 'Dan Dan' });
          expect(node1).to.be.null;

          const node2 = digger.findOneNode({ 'birthYear': 2000 });
          expect(node2).to.be.null;

          const node3 = digger.findOneNode({ 'title': /intern/i });
          expect(node3).to.be.null;

          const node4 = digger.findOneNode({ 'xx': 'xx' });
          expect(node4).to.be.null;

          const node5 = digger.findOneNode({ 'xx': 100 });
          expect(node5).to.be.null;

          const node6 = digger.findOneNode({ 'xx': true });
          expect(node6).to.be.null;

          const node7 = digger.findOneNode({ 'xx': /xx/i });
          expect(node7).to.be.null;
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should return null', () => {
          const node1 = digger.findOneNode(null);
          expect(node1).to.be.null;

          const node2 = digger.findOneNode(undefined);
          expect(node2).to.be.null;

          const node3 = digger.findOneNode('');
          expect(node3).to.be.null;
      });
    });

  });

  describe('#findNodes()', () => {

    context('when the nodes exist', () => {
      it('should return node xiangxiang with name "Xiang Xiang"', () => {
        const nodes = digger.findNodes({'name': 'Xiang Xiang'});
        nodes.length.should.equal(1);
        nodes[0].name.should.equal('Xiang Xiang');
      });

      it('there is only one employee who is born in 1980', () => {
        const nodes = digger.findNodes({ 'birthYear': 1980 });
        nodes.length.should.equal(1);
      });

      it('there are 5 engineer nodes', () => {
        const nodes = digger.findNodes({ 'title': /engineer/i });
        nodes.length.should.equal(5);
      });

      it('there are 5 shareholder nodes', () => {
        const nodes = digger.findNodes({ 'isShareholder': true });
        nodes.length.should.equal(5);
      });

      it('there are 5 non-shareholder nodes', () => {
        const nodes = digger.findNodes({ 'isShareholder': false });
        nodes.length.should.equal(5);
      });

      it('there are 5 engineer nodes', () => {
        const nodes = digger.findNodes({ 'title': /engineer/i });
        nodes.length.should.equal(5);
      });

      it('there are 2 post-80s engineer nodes', () => {
        const nodes = digger.findNodes({ 'title': /engineer/i, 'birthYear': { '>=': 1980, '<': 1990 }});
        nodes.length.should.equal(2);
      });
    });

    context('when the nodes don\'t exist', () => {
      it('should return []', () => {
        const nodes1 = digger.findNodes({ 'name': 'Dan Dan' });
        nodes1.should.eql([]);

        const nodes2 = digger.findNodes({ 'birthYear': 2000 });
        nodes2.should.eql([]);

        const nodes3 = digger.findNodes({ 'title': /intern/i });
        nodes3.should.eql([]);

        const nodes4 = digger.findNodes({ 'xx': 'xx' });
        nodes4.should.eql([]);

        const nodes5 = digger.findNodes({ 'xx': 100 });
        nodes5.should.eql([]);

        const nodes6 = digger.findNodes({ 'xx': true });
        nodes6.should.eql([]);

        const nodes7 = digger.findNodes({ 'xx': /xx/i });
        nodes7.should.eql([]);
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should return [] when conditions are invalid', () => {
        const nodes1 = digger.findNodes(null);
        nodes1.should.eql([]);

        const nodes2 = digger.findNodes(undefined);
        nodes2.should.eql([]);

        const nodes3 = digger.findNodes('');
        nodes3.should.eql([]);
      });
    });

  });

  describe('#findParent()', () => {
    context('when the parent node exists', () => {
      it('should return node "Lao Lao" when id is "2"', () => {
        const node = digger.findParent('2');
        node.name.should.equal('Lao Lao');
      });
      it('should return node "Su Miao" when id is "4"', () => {
        const node = digger.findParent('4');
        node.name.should.equal('Su Miao');
      });
      it('should return node "Hei Hei" when id is "7"', () => {
        const node = digger.findParent('7');
        node.name.should.equal('Hei Hei');
      });
    });

    context('when the parent node doesn\'t exist', () => {
      it('should throw an error', () => {
        const node1 = digger.findParent('1');
        expect(node1).to.be.null;

        const node2 = digger.findParent('11');
        expect(node2).to.be.null;
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error when id is invalid', () => {
        const node1 = digger.findParent(null);
        expect(node1).to.be.null;

        const node2 = digger.findParent(undefined);
        expect(node2).to.be.null;

        const node3 = digger.findParent('');
        expect(node3).to.be.null;
      });
    });
  
  });

  describe('#findSiblings()', () => {

    context('when the sibling nodes exist', () => {
      it('should return 3 sibling nodes when searching bomiao\'s siblings', () => {
        const nodes = digger.findSiblings('2');
        nodes.length.should.equal(3);
        nodes[nodes.length - 1].name.should.equal('Chun Miao');
      });

      it('should return 1 sibling nodes when searching panpang\'s siblings', () => {
        const nodes = digger.findSiblings('6');
        nodes.length.should.equal(1);
        nodes[nodes.length - 1].name.should.equal('Xiang Xiang');
      });

      it('should return 0 sibling nodes when searching renwu\'s siblings', () => {
        const nodes = digger.findSiblings('10');
        nodes.should.eql([]);
      });

    });

    context('when the sibling nodes don\'t exist', () => {
      it('should throw an error', () => {
        const nodes = digger.findSiblings('1');
        nodes.should.eql([]);
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error when id is invalid', () => {
          const nodes1 = digger.findSiblings(null);
          nodes1.should.eql([]);

          const nodes2 = digger.findSiblings(undefined);
          nodes2.should.eql([]);

          const nodes3 = digger.findSiblings('');
          nodes3.should.eql([]);
      });
    });

  });

  describe('#findAncestors()', () => {

    context('when the ancestor nodes exist', () => {
      it('should return 1 ancestor nodes when searching sumiao\'s ancestors', () => {
        const nodes = digger.findAncestors('3');
        nodes.length.should.equal(1);
        nodes[0].name.should.equal('Lao Lao');
      });

      it('should return 2 ancestor nodes when searching heihei\'s ancestors', () => {
        const nodes = digger.findAncestors('5');
        nodes.length.should.equal(2);
        nodes[0].name.should.equal('Su Miao');
        nodes[1].name.should.equal('Lao Lao');
      });

      it('should return 3 ancestor nodes when searching xiangxiang\'s ancestors', () => {
        const nodes = digger.findAncestors('7');
        nodes.length.should.equal(3);
        nodes[0].name.should.equal('Hei Hei');
        nodes[1].name.should.equal('Su Miao');
        nodes[2].name.should.equal('Lao Lao');
      });
    });

    context('when the ancestor nodes don\'t exist', () => {
      it('should throw an error', () => {
        const nodes = digger.findAncestors('1');
        nodes.should.eql([]);
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should throw an error when id is invalid', () => {
        const nodes1 = digger.findAncestors(null);
        nodes1.should.eql([]);

        const nodes2 = digger.findAncestors(undefined);
        nodes2.should.eql([]);

        const nodes3 = digger.findAncestors('');
        nodes3.should.eql([]);
      });
    });

  });

  describe('#addChildren()', () => {

    context('when adding single node', () => {
      it('could add child node to root node', () => {
        digger.addChildren('1', { pk: '11', name: 'Yu Jie' }).should.be.true;
        datasource.inferiors.some(item => item.name === 'Yu Jie').should.be.true;
      });

      it('could add child node to middle level node', () => {
        digger.addChildren('5', { pk: '11', name: 'Dan Dan' }).should.be.true;
        datasource.inferiors[1].inferiors[1].inferiors.some(item => item.name === 'Dan Dan').should.be.true;
      });

      it('could add child node to leaf node', () => {
        digger.addChildren('10', { pk: '11', name: 'Fei Xuan' }).should.be.true;
        datasource.inferiors[0].inferiors[0].inferiors.some(item => item.name === 'Fei Xuan').should.be.true;
      });
    });

    context('when adding multiple nodes', () => {
      it('could add child nodes to root node', () => {
        digger.addChildren('1', [{ pk: '11', name: 'Yu Jie' }, { pk: '12', name: 'Yu Li' }]).should.be.true;
        datasource.inferiors.some(item => item.name === 'Yu Jie').should.be.true;
        datasource.inferiors.some(item => item.name === 'Yu Li').should.be.true;
      });

      it('could add child nodes to middle level node', () => {
        digger.addChildren('5', [{ pk: '11', name: 'Dan Dan' }, { pk: '12', name: 'Er Dan' }]).should.be.true;
        datasource.inferiors[1].inferiors[1].inferiors.some(item => item.name === 'Dan Dan').should.be.true;
        datasource.inferiors[1].inferiors[1].inferiors.some(item => item.name === 'Er Dan').should.be.true;
      });

      it('could add child nodes to leaf node', () => {
        digger.addChildren('10', [{ pk: '11', name: 'Fei Xuan' }, { pk: '12', name: 'Er Xuan' }]).should.be.true;
        datasource.inferiors[0].inferiors[0].inferiors.some(item => item.name === 'Fei Xuan').should.be.true;
        datasource.inferiors[0].inferiors[0].inferiors.some(item => item.name === 'Er Xuan').should.be.true;
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should return false when id is invalid', () => {
          digger.addChildren(null).should.be.false;
          digger.addChildren(undefined).should.be.false;
          digger.addChildren('').should.be.false;
      });

      it('should return false when data is invalid', () => {
        digger.addChildren('1').should.be.false;
        digger.addChildren('1', 1).should.be.false;
        digger.addChildren('1', 'xx').should.be.false;
        digger.addChildren('1', null).should.be.false;
        digger.addChildren('1', undefined).should.be.false;
        digger.addChildren('1', {}).should.be.false;
        digger.addChildren('1', []).should.be.false;
        digger.addChildren('1', [1]).should.be.false;
        digger.addChildren('1', ['xx']).should.be.false;
        digger.addChildren('1', [null]).should.be.false;
        digger.addChildren('1', [undefined]).should.be.false;
        digger.addChildren('1', [{}]).should.be.false;
      });

      it('should return false when parent node can\'t be found', async () => {
        digger.addChildren('11', { id: '11', name: 'Yu Jie' }).should.be.false;
      });
    });
  });

  describe('#addSiblings()', () => {

    context('when adding single node', () => {
      it('could add sibling node to middle level node', () => {
        digger.addSiblings('5', { pk: '11', name: 'Dan Dan' }).should.be.true;
        datasource.inferiors[1].inferiors.some(item => item.name === 'Dan Dan').should.be.true;
      });

      it('could add sibling node to leaf node', () => {
        digger.addSiblings('10', { pk: '11', name: 'Fei Xuan' }).should.be.true;
        datasource.inferiors[0].inferiors.some(item => item.name === 'Fei Xuan').should.be.true;
      });
    });

    context('when adding multiple nodes', () => {
      it('could add sibling nodes to middle level node', () => {
        digger.addSiblings('5', [{ pk: '11', name: 'Dan Dan' }, { pk: '12', name: 'Er Dan' }]).should.be.true;
        datasource.inferiors[1].inferiors.some(item => item.name === 'Dan Dan').should.be.true;
        datasource.inferiors[1].inferiors.some(item => item.name === 'Er Dan').should.be.true;
      });

      it('could add sibling nodes to leaf node', () => {
        digger.addSiblings('10', [{ pk: '11', name: 'Fei Xuan' }, { pk: '12', name: 'Er Xuan' }]).should.be.true;
        datasource.inferiors[0].inferiors.some(item => item.name === 'Fei Xuan').should.be.true;
        datasource.inferiors[0].inferiors.some(item => item.name === 'Er Xuan').should.be.true;
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should return false when id is invalid', () => {
        digger.addSiblings(null).should.be.false;
        digger.addSiblings(undefined).should.be.false;
        digger.addSiblings('').should.be.false;
      });

      it('should return false when data is invalid', () => {
        digger.addSiblings('1').should.be.false;
        digger.addSiblings('1', 1).should.be.false;
        digger.addSiblings('1', 'xx').should.be.false;
        digger.addSiblings('1', null).should.be.false;
        digger.addSiblings('1', undefined).should.be.false;
        digger.addSiblings('1', {}).should.be.false;
        digger.addSiblings('1', []).should.be.false;
        digger.addSiblings('1', [1]).should.be.false;
        digger.addSiblings('1', ['xx']).should.be.false;
        digger.addSiblings('1', [null]).should.be.false;
        digger.addSiblings('1', [undefined]).should.be.false;
        digger.addSiblings('1', [{}]).should.be.false;
      });
    });
  });

  describe('#addRoot()', () => {

    context('when adding root node', () => {
      it('could add root node with new properties', () => {
        digger.addRoot({ pk: '11', name: 'Dan Dan' }).should.be.true;
        datasource.pk.should.equal('11');
        datasource.name.should.equal('Dan Dan');
        datasource.inferiors.length.should.equal(1);
        expect(datasource.title).to.be.undefined;
        expect(datasource.isShareholder).to.be.undefined;
        expect(datasource.birthYear).to.be.undefined;
      });

      it('could add root node without children property', () => {
        digger.addRoot({ pk: '11', name: 'Dan Dan', 'inferiors': [{ pk: '12'}, { pk: '13'}] }).should.be.true;
        datasource.inferiors.length.should.equal(1);
        datasource.inferiors[0].name.should.equal('Lao Lao');
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should return false', () => {
        digger.addRoot(null).should.be.false;
        digger.addRoot(undefined).should.be.false;
        digger.addRoot('').should.be.false;
      });
    });
  });

  describe('#updateNode()', () => {

    context('when updating root node', () => {
      it('could update node with new properties', () => {
        digger.updateNode({ pk: '1', name: 'Lao Ye' }).should.be.true;
        datasource.name.should.equal('Lao Ye');
        datasource.title.should.equal('general manager');
        datasource.inferiors.length.should.equal(4);
      });
    });

    context('when users don\'t provide valid parameters', () => {
      it('should return false', () => {
        digger.updateNode(null).should.be.false;
        digger.updateNode(undefined).should.be.false;
        digger.updateNode('').should.be.false;
        digger.updateNode({}).should.be.false;
        digger.updateNode({ 'name': 'Lao Ye' }).should.be.false;
      });
    });
  });

  describe('#updateNodes()', () => {

    context('when updating root node', () => {
      it('could update node with new properties', () => {
        digger.updateNodes(['1'], { name: 'Lao Ye' }).should.be.true;
        datasource.name.should.equal('Lao Ye');
        datasource.title.should.equal('general manager');
        datasource.inferiors.length.should.equal(4);
      });
    });

    context('when updating leaf nodes', () => {
      it('could update multiple leaf nodes with new properties', () => {
        digger.updateNodes(['6', '7', '10'], { title: 'senior engineer' }).should.be.true;
        digger.findNodeById('6').title.should.equal('senior engineer');
        digger.findNodeById('7').title.should.equal('senior engineer');
        digger.findNodeById('10').title.should.equal('senior engineer');
      });
    });

    context('when updating common nodes', () => {
      it('could update multiple common nodes with new properties', () => {
        digger.updateNodes(['4', '5'], { title: 'chief scientist' }).should.be.true;
        digger.findNodeById('4').title.should.equal('chief scientist');
        digger.findNodeById('5').title.should.equal('chief scientist');
      });
    });

    context('when users don\'t provide valid parameters', () => {

      it('should return fasle', () => {
        digger.updateNodes(null).should.be.false;
        digger.updateNodes(undefined).should.be.false;
        digger.updateNodes('').should.be.false;
        digger.updateNodes(['1']).should.be.false;
        digger.updateNodes(['1'], null).should.be.false;
        digger.updateNodes(['1'], undefined).should.be.false;
        digger.updateNodes(['1'], {}).should.be.false;
      });

    });

  });

  describe('#removeNode()', () => {
    context('when removing multiple nodes one by one', () => {
      it('could remove nodes which are not related', () => {
        digger.removeNode('4');
        digger.removeNode('7');
        datasource.inferiors[1].inferiors.length.should.equal(1);
        datasource.inferiors[1].inferiors[0].inferiors.length.should.equal(1);
      });

      it('could remove nodes which are peer nodes one by one', () => {
        digger.removeNode('2');
        digger.removeNode('3');
        datasource.inferiors.length.should.equal(2);
      });
    });
  });

  describe('#removeNodes()', () => {

    context('when removing single node', () => {
      it('could remove middle level node', () => {
        digger.removeNodes('4');
        datasource.inferiors[1].inferiors.length.should.equal(1);
      });

      it('could remove leaf node', () => {
        digger.removeNodes('7');
        datasource.inferiors[1].inferiors[1].inferiors.length.should.equal(1);
      });

      it('could not remove root node', () => {
        digger.removeNodes('1').should.be.false;
      });
    });

    context('when removing multiple nodes', () => {
      it('could remove nodes which are not related', () => {
        digger.removeNodes(['4', '7']);
        datasource.inferiors[1].inferiors.length.should.equal(1);
        datasource.inferiors[1].inferiors[0].inferiors.length.should.equal(1);
      });

      it('could remove nodes which are peer nodes', () => {
        digger.removeNodes(['2', '3']);
        datasource.inferiors.length.should.equal(2);
      });
    });

    context('when removing nodes based on conditions', () => {
      it('could remove nodes which are under the same query conditions', () => {
        digger.removeNodes({ title: 'principle engineer' });
        datasource.inferiors[0].inferiors.length.should.equal(0);
        datasource.inferiors[1].inferiors.length.should.equal(1);
      });

      it('could remove one node with id query conditions', () => {
        digger.removeNodes({ pk: '5' });
        datasource.inferiors[1].inferiors.length.should.equal(1);
      });
    });

    context('when users don\'t provide valid parameters', () => {

      it('should return false', async () => {
        digger.removeNodes(null).should.be.false;
        digger.removeNodes(undefined).should.be.false;
        digger.removeNodes('').should.be.false;
        digger.removeNodes({}).should.be.false;
        digger.removeNodes('1').should.be.false;
        digger.removeNodes('11').should.be.false;
        digger.removeNodes(['11']).should.be.false;
        digger.removeNodes({ pk: '11' }).should.be.false;
        digger.removeNodes({ 'name': 'Lao Ye' }).should.be.false;
      });
    });
  });

});