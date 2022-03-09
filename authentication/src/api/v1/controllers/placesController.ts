import { Request, Response } from 'express';
import placesModel from '../models/places/places';

/**
 * Get the servers public key
 * @route GET /places
 */
export const getPlaces = async (req: Request, res: Response): Promise<void> => {
  const allPlaces = await placesModel.getNearPlaces();
  res.status(200).json({
    message: allPlaces,
  });
};

export default { getPlaces };
