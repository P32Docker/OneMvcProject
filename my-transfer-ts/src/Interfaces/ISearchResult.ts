import type {IPagination} from "./IPagination.ts";

export interface ISearchResult<T> {
    items: T[];
    pagination: IPagination;
}