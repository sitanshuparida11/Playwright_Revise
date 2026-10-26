const s1 = "hello";
console.log(s1.split('').reverse().join(''));


const str = 'madam';
console.log(str === str.split('').reverse().join(''));

const arr = [1,1,2,3];
console.log ([...new Set(arr)]);

const arr1= [1,2,5,6];
const unique = [...new Set(arr)];
unique.sort((a,b)=>b-a);
console.log(unique[1]);


const str2 =[1,2,2,5,4,7]
const obj ={[key: string]:number }={};

for(let ch of str2)
{
  obj[ch] =(obj[ch] || 0)+1;

}
console.log(obj);

const arr =[1,2,3,6,4]
const unique=[...new Set (arr)];
unique.sort((a,b)=>b-a);
console.log(unique[1]);