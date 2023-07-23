import Album from './Album.js';
import Artist from './Artist.js';

interface Song {
  id: string;
  title: {
    regular: string;
    withFeatured?: string;
    full?: string;
  };
  url?: string;
  artists?: {
    primary?: Artist;
    featured?: Artist[];
    text?: string;
  };
  album?: Album;
  description?: string;
  releaseDate?: string;
  image?: string;
  hasLyrics?: boolean;
  embed?: string;
}

export default Song;
