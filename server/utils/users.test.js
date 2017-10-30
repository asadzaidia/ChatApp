const expect=require('expect');
const {Users}=require('./Users');

describe('Users',()=>{
  it('should add new user',()=>{
  var users=new Users();
  var user={
    id:'123',
    name:'asad',
    room:'Meeting'
  };
  var resUser=users.addUser(user.id,user.name,user.room);
  expect(users.users).toEqual([user]);
  });
});
