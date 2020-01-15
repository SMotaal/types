// declare global {
//   namespace Coeracible {
//     type value = bigint | boolean | number;
//     type primitive = value | symbol | undefined;
//     type typeOf<T extends primitive> = T extends bigint
//       ? 'bigint'
//       : T extends boolean
//       ? 'boolean'
//       : T extends number
//       ? 'number'
//       : T extends symbol
//       ? 'symbol'
//       : T extends undefined
//       ? 'undefined'
//       : T extends Function
//       ? 'function'
//       : 'object';
//     interface Value<T extends value> {
//       valueOf(...args: [] | any[]): T;
//       [Symbol.toPrimitive](hint: typeOf<T>): T;
//     }
//     interface String {
//       toString(): string;
//       [Symbol.toPrimitive](hint: 'string'): string;
//     }
//   }

//   type Coeracible<T> = T extends string ? Coeracible.String : T extends Coeracible.value ? Coeracible.Value<T> : never;
// }

// // interface TypeMap {
// //   string: string;
// //   bigint: bigint;
// //   boolean: boolean;
// //   number: number;
// //   symbol: symbol;
// //   undefined: undefined;
// //   function: Function;
// //   object: object;
// // }
