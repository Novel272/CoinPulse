"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { buildPageNumbers, cn, ELLIPSIS } from "@/lib/utils";
const CoinPagination = ({
  currentPage,
  totalPages,
  hasMorePages,
}: Pagination) => {
  const router = useRouter();

  const handlePage = (page: number) => {
    router.push(`/coins?page=${page}`);
  };

  const pageNumber = buildPageNumbers(currentPage, totalPages);
  const isLastPage = !hasMorePages || currentPage === totalPages;

  return (
    <Pagination id="coins-pagination">
      <PaginationContent className="pagination-content">
        <PaginationItem className="pagination-control prev">
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePage(currentPage - 1)}
            className={currentPage == 1 ? "control-disabled" : "control-button"}
          />
        </PaginationItem>
        <div className="pagination-pages">
          {pageNumber.map((page, index) => (
            <PaginationItem key={index}>
              {page === ELLIPSIS ? (
                <span className="ellipsis">...</span>
              ) : (
                <PaginationLink
                  onClick={() => handlePage(page)}
                  className={cn("page-link", {
                    "page-link-active": currentPage === page,
                  })}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem className="pagination-control next">
          <PaginationNext
            onClick={() => !isLastPage && handlePage(currentPage + 1)}
            className={isLastPage ? "control-disabled" : "control-button"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CoinPagination;
