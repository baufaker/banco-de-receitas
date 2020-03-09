import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any, propName: string, extraPropName?: string): any {
    if (extraPropName) {
      value.sort(function (a, b) {
        // console.log('extraPropName: ', extraPropName);
        if (a.ingredient[propName] < b.ingredient[propName]) {
          return -1;
        }
        if (a.ingredient[propName] > b.ingredient[propName]) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });
    } else {
      value.sort(function (a, b) {
        if (a[propName] < b[propName]) {
          return -1;
        }
        if (a[propName] > b[propName]) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });
    }

    return value;
  }

}
