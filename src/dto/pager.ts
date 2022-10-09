/*DTO (Data Transfer Object) schema. 
A DTO is an object that defines how the data will be sent over the network. 
Better to define these using classes with Typescript.

 In order to make the class properties visible to the SwaggerModule, 
 we annotate them with the @ApiProperty() decorator. 
*/
import { ApiProperty } from '@nestjs/swagger';

export class Pager {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  startPage: number;

  @ApiProperty()
  endPage: number;

  @ApiProperty()
  startIndex: number;

  @ApiProperty()
  endIndex: number;

  @ApiProperty({
    isArray: true,
    type: Number,
  })
  pages: number[];

  constructor(
    totalItems: number,
    currentPage: number,
    limit: number,
    startIndex: number,
  ) {
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.limit = limit;
    this.startIndex = startIndex;

    // calculate total pages
    this.totalPages = Math.ceil(totalItems / limit);
    let startPage: number, endPage: number;
    const maxPages = 10;
    if (this.totalPages <= maxPages) {
      // total pages less than max so show all pages
      startPage = 1;
      endPage = this.totalPages;
    } else {
      // total pages more than max so calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = maxPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= this.totalPages) {
        // current page near the end
        startPage = this.totalPages - maxPages + 1;
        endPage = this.totalPages;
      } else {
        // current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
    // create an array of pages to ng-repeat in the pager control
    this.pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i,
    );
  }
}

export const getStartIndex = function (page, limit) {
  return (page - 1) * limit;
};

export class PaginationDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
