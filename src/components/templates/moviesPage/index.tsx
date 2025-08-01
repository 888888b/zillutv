// hooks
import useTmdbFetch from '@/components/hooks/tmdb';

// componentes
import HeaderCarousel from '@/components/organisms/headerCarousel';
import MoviesSection from './moviesSection';

// tipos
import { tmdbObjProps } from '@/contexts/tmdbContext';

// funções utilitarias
import { checkAvailability } from '@/components/utils/tmdbApiData/availability';
import { getContentId } from '@/components/utils/tmdbApiData/id';
import { ScrollToTop } from '@/components/utils/globalActions/scrollToTop';

export default async function MoviesPage() {

    const contentData: tmdbObjProps[]  = [];
    const { 
        fetchPopularMovies,
        fetchMoviesByIdList
    } = useTmdbFetch();

    const popularMovies = await fetchPopularMovies();
    const moviesIdList = await getContentId( popularMovies );
    const movies = await fetchMoviesByIdList( moviesIdList );
    const filtered = await checkAvailability( movies );
    contentData.push( ...filtered );

    return contentData ? (
        <>
            <div className='w-full min-h-screen font-inter'>
                <HeaderCarousel
                    slidesType='movie'
                    slidesData={contentData}
                    currentPage='movies'
                />
                <MoviesSection/>
            </div>

            <ScrollToTop/>
        </>
    ) : null;
};