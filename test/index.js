import { should } from 'chai';
import JSONDigger from '../src/index';
should();

describe('JSONDigger', () => {

  let datasource, digger;

  beforeEach(() => {
    datasource = {
      id: '1',
      name: 'Lao Lao',
      title: 'general manager',
      children: [
        { id: '2', name: 'Bo Miao', title: 'department manager' },
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
      it('should return node "Lao Lao" when id is "1"', () => {
        digger.findNodeById(datasource, '1').then(node => {
          node.name.should.equal('Lao Lao');
        });
      });
      it('should return node "Tie Hua" when id is "4"', () => {
        digger.findNodeById(datasource, '4').then(node => {
          node.name.should.equal('Tie Hua');
        });
      });
      it('should return node "Pang Pang" when id is "6"', () => {
        digger.findNodeById(datasource, '6').then(node => {
          node.name.should.equal('Pang Pang');
        });
      });
    });

    context('when the node with given id doesn\'t exist', () => {
      it('should throw an error with message "the node does not exist"', () => {
        digger.findNodeById(datasource, '10').catch(err => {
          err.message.should.equal('the node does not exist');
        });
      });
    });

    context('when users don\'t provide enough and valid parameters', () => {
      it('should throw an error with message "target object is invalid" when providing empty object', () => {
        digger.findNodeById(null, '6').catch(err => {
          err.message.should.equal('target object is invalid');
        });
        digger.findNodeById(undefined, '6').catch(err => {
          err.message.should.equal('target object is invalid');
        });
        digger.findNodeById({}, '6').catch(err => {
          err.message.should.equal('target object is invalid');
        });
        digger.findNodeById(datasource, null).catch(err => {
          err.message.should.equal('target id is invalid');
        });
        digger.findNodeById(datasource, undefined).catch(err => {
          err.message.should.equal('target id is invalid');
        });
        digger.findNodeById(datasource, '').catch(err => {
          err.message.should.equal('target id is invalid');
        });
      });
    });

  });
});