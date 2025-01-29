import { FalseyValuesPipe } from './falsy-values.pipe';

describe('FalseyValuesPipe', () => {
  it('create an instance', () => {
    const pipe = new FalseyValuesPipe();
    expect(pipe).toBeTruthy();
  });
});
