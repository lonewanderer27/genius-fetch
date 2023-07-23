import Artist from './Artist.js';

interface Album {
  id: string;
  title: {
    regular: string;
    full?: string;
  };
  url?: string;
  description?: string;
  releaseDate?: {
    year?: number;
    month?: number;
    day?: number;
    text?: string;
  };
  image?: string;
  artist?: Artist;
}

export default Album;
