const expect =require('expect');
const {isRealString}=require('./validation');

//isRealString
describe('isRealString',()=>{
it('Should reject non-string values',()=>{
  var res=isRealString(98);
  expect(res).toBe(false);
});
it('Should reject string with only spaces',()=>{
  var res=isRealString('     ');
  expect(res).toBe(false);
});

  if('Should allow string with non-spave characters',()=>{
    var res=isRealString('  Andrew   ');
    expect(res).toBe(true);
  });
});
