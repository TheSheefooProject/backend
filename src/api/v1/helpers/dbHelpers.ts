import sql from "mssql";
import AppError from "../interfaces/AppError";
export enum APIStatus {
    Error,
    Success,
    Failed,
}

/**
 * Below is the interface and structure that allows database queries to be returned
 */
interface GetQueryResult {
    status: APIStatus;
    errorMessage?: string;
    data: any[];
    empty: boolean;
}
export async function getQuery(
    SQLQuery: string,
    rawResult = false,
): Promise<GetQueryResult> {
    try {
        const data = await sql.query(SQLQuery);

        return {
            status: Boolean(data.recordset.length)
                ? APIStatus.Success
                : APIStatus.Failed,
            data: rawResult ? data : data.recordset,
            empty: !Boolean(data.recordset.length),
        };
    } catch (e) {
        console.error("Internal SQL Error", e);
        throw new AppError();
    }
}

/**
 * Below is the interface and structure that allows database queries to be returned
 */
interface UpdateQueryResult {
    status: APIStatus;
    errorMessage?: string;
    rows?: number;
}
export async function updateQuery(
    SQLQuery: string,
): Promise<UpdateQueryResult> {
    try {
        const data = await sql.query(SQLQuery);
        return {
            status: Boolean(data.rowsAffected[0])
                ? APIStatus.Success
                : APIStatus.Failed,
            rows: data.rowsAffected[0],
        };
    } catch (e) {
        console.error("Internal SQL Error", e);
        throw new AppError();
    }
}

export default { getQuery, updateQuery, APIStatus };
