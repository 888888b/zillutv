'use client';

// hooks
import { 
    useCallback, 
    useState, 
    useEffect 
} from "react";
import useTmdbFetch from "@/components/hooks/tmdb";

// componentes
import GenreSelect from "@/components/molecules/categorySelect";
import Series from "@/components/organisms/moviesSeriesSection";

// funções utilitarias
import { checkAvailability } from "@/components/utils/tmdbApiData/availability";

import { tmdbSerieGenres } from "@/app/constants";
import { tmdbObjProps } from "@/contexts/tmdbContext";

type ComponentProps = {
    className?: string
};

export default function SeriesSection( props: ComponentProps ) {

    const [ selectedGenre, setSelectedGenre ] = useState('release');
    const [ 
        contentData, 
        setContentData 
    ] = useState<tmdbObjProps[] | null>( null );

    // funções para buscar series
    const {
        fetchSeriesByGenre,
        fetchReleasedSeries
    } = useTmdbFetch();

    const updateSelectedGenre = useCallback(( newGenre: string ) => {
        setSelectedGenre( newGenre );
    }, []);

    // buscar series por genero
    const fetchSeries = async () => {
        const series = await fetchSeriesByGenre( selectedGenre );
        const filtered = await checkAvailability( series );
        setContentData([ ...filtered ]);
    };

     // buscar as series mais recentes
     const fetchLatestSeries = async () => {
        const series = await fetchReleasedSeries();
        const filtered = await checkAvailability( series );
        setContentData([ ...filtered ]);
    };

    useEffect(() => {
        if ( selectedGenre === 'release' ) {
            fetchLatestSeries();
        } else {
            fetchSeries();
        };       
    }, [ selectedGenre ]);

    return (
        <div className={`flex flex-col gap-y-10 px-5 sm:px-10 lg:px-[70px] mt-20 mb-12 sm:mb-0 sm:mt-0 sm:-translate-y-14 relative z-10 ${props.className}`}>
            <GenreSelect
                onSelectGenre={updateSelectedGenre}
                genresList={tmdbSerieGenres}
            />
            { contentData ?
                <Series data={contentData} mediaType="serie"/>
            : null }
        </div>
    );
};