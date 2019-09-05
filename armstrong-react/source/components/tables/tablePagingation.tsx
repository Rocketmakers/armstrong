import * as React from "react";
import { utils } from "../../utilities/utils";

import "./styles.scss";

export const GO_LEFT_PAGE_INDEX = -1;
export const GO_RIGHT_PAGE_INDEX = -2;

export type TDirection = "left" | "right";

export interface IPaginateButtonProps {
  active: boolean;
  index: number;
  onClick: (i: number) => void;
  direction?: TDirection;
}
interface ITablePagination {
  currentPage: number;
  pageNeighbours?: number;
  render: React.FC<{ index: number; direction?: TDirection }>;
  totalPages: number;
}

export const TablePagination: React.FunctionComponent<ITablePagination> = ({
  currentPage,
  pageNeighbours = 1,
  render: Render,
  totalPages,
}) => {
  const [pageNumbers, setPageNumbers] = React.useState<number[]>([]);

  const calculatePages = React.useCallback(
    (curPage: number) => {
      const totalNumbers = pageNeighbours * 2 + 3;
      const totalBlocks = totalNumbers + 2;

      if (totalPages > totalBlocks) {
        const startPage = Math.max(2, curPage - pageNeighbours);
        const endPage = Math.min(totalPages - 1, curPage + pageNeighbours);
        let pages = utils.array.range(startPage, endPage, 1, true);
        const hasLeftNeighbour = startPage > 2;
        const hasRightNeighbour = totalPages - endPage > 1;
        const offset = totalNumbers - (pages.length + 1);

        if (hasLeftNeighbour && !hasRightNeighbour) {
          const extraPages = utils.array.range(
            startPage - offset,
            startPage - 1,
            1,
            true,
          );
          pages = [GO_LEFT_PAGE_INDEX, ...extraPages, ...pages];
        } else if (!hasLeftNeighbour && hasRightNeighbour) {
          const extraPages = utils.array.range(
            endPage + 1,
            endPage + offset,
            1,
            true,
          );
          pages = [...pages, ...extraPages, GO_RIGHT_PAGE_INDEX];
        } else if (hasLeftNeighbour && hasRightNeighbour) {
          pages = [GO_LEFT_PAGE_INDEX, ...pages, GO_RIGHT_PAGE_INDEX];
        } else {
          pages = [GO_LEFT_PAGE_INDEX, ...pages, GO_RIGHT_PAGE_INDEX];
        }
        return [1, ...pages, totalPages];
      }
      return utils.array.range(1, totalPages, 1, true);
    },
    [currentPage],
  );

  React.useEffect(() => {
    setPageNumbers(calculatePages(currentPage));
  }, [currentPage, totalPages]);

  React.useEffect(() => {
    setPageNumbers(calculatePages(currentPage));
  }, []);

  const goLeft = React.useCallback(() => {
    return Math.max(0, Math.min(currentPage - pageNeighbours * 2 - 1));
  }, [currentPage]);

  const goRight = React.useCallback(() => {
    return Math.max(0, Math.min(currentPage + pageNeighbours * 2 + 1));
  }, [currentPage]);

  return (
    <div>
      <div>
        {pageNumbers.map((page, index) => {
          if (page === GO_LEFT_PAGE_INDEX) {
            return <Render key={page} index={goLeft()} direction="left" />;
          } else if (page === GO_RIGHT_PAGE_INDEX) {
            return <Render key={page} index={goRight()} direction="right" />;
          } else {
            return <Render key={page} index={page} />;
          }
        })}
      </div>
    </div>
  );
};
