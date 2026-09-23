import {describe,it,expect} from 'vitest';
function split(total,max){const out=[];let r=Number(total);while(r>0){const a=Math.min(r,Number(max));out.push(a);r-=a}return out}
describe('payment splitting',()=>{it('splits 4500 by 1999',()=>expect(split(4500,1999)).toEqual([1999,1999,502]));it('handles equal',()=>expect(split(1999,1999)).toEqual([1999]));it('handles remainder',()=>expect(split(2000,1999)).toEqual([1999,1]));it('handles small amount',()=>expect(split(500,1999)).toEqual([500]));});
