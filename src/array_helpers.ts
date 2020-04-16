type NestedArray<T> = Array<NestedArray<T> | T>;

/**
 * [flatten Given a deeply nested array of numbers returns a flattened array]
 * @param  array [NestedArray nested array]
 * @return     [flattened array]
 */
export function flatten (array: NestedArray<number>): Array<number> {
  // some issues with typescript
  return <Array<number>> array.reduce((acc, val) =>
    (<Array<number>> acc).concat(
        Array.isArray(val) ?
          flatten(val) :
          val), []);
}
