const {calculateTip,fahrenheitToCelsius,celsiusToFahrenheit,add}=require('../src/math')

test('should calculate total with tip',()=>
{
     const total=calculateTip(10,0.3)
     expect(total).toBe(13)
     /* if(total!=13)
     {
         throw new Error('Total tip should be 13. Got: '+total)
     } */
})

test('should calculate total with default tip',()=>
{
    const total=calculateTip(10)
    expect(total).toBe(12.5)
})




test('change the given temperature to celsius',()=>
{
  const celcius=fahrenheitToCelsius(32)
  expect(celcius).toBe(0)
})


test('change the given temperature to fahrenheit',()=>
{
 const fahrenheit=celsiusToFahrenheit(0)
 expect(fahrenheit).toBe(32)
})

/* test('Async test demo',(done)=>
{ 
  setTimeout(()=>
  {
    expect(1).toBe(2)
    done()
  },2000)
  
})
 */

test('should add a given number to get a sum',(done)=>
{
         add(2,3).then((sum)=>
         {
               expect(sum).toBe(5)
               done()
         })/* .catch((e)=>
         {

         }) */
})




test('should add sum(a,b) nos async/await',async()=>
{
  const sum=await add(10,11)
  expect(sum).toBe(21)

})


