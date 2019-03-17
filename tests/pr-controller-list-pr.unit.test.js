const { listPR  } = require('../src/pr/controllers');
// jest.mock('../__mocks__/getPRState');


test("should be a middleware function ", async () => {
    expect(listPR).toBeDefined();
    expect(typeof listPR).toBe("function");
});

// test("should through an error with malformed request", async () => {
//     let results = await listPR( {},  {status : () => true, send : () => true}, (err)=>{
//         if(!err){ return new Promise(()=> Promise.resolve({}))};
//     });
//     expect(results).toThrow();
// });