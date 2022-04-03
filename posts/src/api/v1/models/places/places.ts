import dbHelpers from "../../helpers/dbHelpers";

export const getNearPlaces = async (): Promise<any> => {
    const places = await dbHelpers.getQuery("select * from places");
    return places;
};

export default { getNearPlaces };
