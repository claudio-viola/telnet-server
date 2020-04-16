// tslint:disable:arrow-return-shorthand
// tslint:disable:max-func-body-length
// tslint:disable:no-big-function
// tslint:disable:no-duplicate-string
// tslint:disable:no-unused
// tslint:disable:no-identical-functions
// tslint:disable:max-line-length
import * as chai from 'chai';
import { flatten } from 'src/array_helpers';
const expect: Chai.ExpectStatic = chai.expect;

describe('Array Helper Functions', (): void => {

  describe('Flatten Array', (): void => {

    it('should flatten a nested array with multiple deep arrays ', async () => {
      const nestedArray = [ 1, 2, [ 3, 4 , [ 5 ] , 6 , [7, [ 8, [ 9 ] ] ] ] ];
      const flattenedArray = flatten(nestedArray);
      expect(flattenedArray).to.deep.equal([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
    });

    it('should flatten an array with no deep levels', async () => {
      const nestedArray = [ 1 ];
      const flattenedArray = flatten(nestedArray);
      expect(flattenedArray).to.deep.equal([ 1 ]);
    });
  });
});
