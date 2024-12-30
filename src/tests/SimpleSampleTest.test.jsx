// This is only a simple test just for the purpose to have a test. If no test exists, github actions will complain.
const a = 1;
const b = 2;
const res = 3;

test("Check that two numbers are equal to result.", () => {
  expect(a + b).toBe(res);
});
