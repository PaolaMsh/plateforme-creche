import '../styles/crèche_garderie.css';
import config from "../config";
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const CrecheGarderie = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("name") || '');
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
    const [creches, setCreches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filteredCreches, setFilteredCreches] = useState([]);
    const [locationFilter, setLocationFilter] = useState('');
    const [totalResults, setTotalResults] = useState(0);
    const [resultsPerPage] = useState(10);

    const cancelToken = useRef();

    useEffect(() => {
        fetchCreches(searchTerm, page);
    }, [searchParams]);

    useEffect(() => {
        if (locationFilter) {
            const filtered = creches.filter(creche =>
                creche.address && creche.address.toLowerCase().includes(locationFilter.toLowerCase())
            );
            setFilteredCreches(filtered);
        } else {
            setFilteredCreches(creches);
        }
    }, [creches, locationFilter]);

    const fetchCreches = async (term = '', page = 1) => {
        if (cancelToken.current) {
            cancelToken.current.cancel('Requête annulée pour nouvelle recherche');
        }

        cancelToken.current = axios.CancelToken.source();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${config.API_BASE_URL}mynursery/`, {
                params: {
                    name: term,
                    page: page,
                    page_size: resultsPerPage
                },
                cancelToken: cancelToken.current.token
            });

            setCreches(response.data.results);
            setFilteredCreches(response.data.results);
            setTotalResults(response.data.count || 0);
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError(err.message);
                setCreches([]);
                setFilteredCreches([]);
                setTotalResults(0);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchParams({ name: searchTerm, page: "1" });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSearchParams({ name: searchTerm, page: newPage.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='creche-garderie-container'>
            <div className='search-container'>
                <h1>Trouver une crèche</h1>
                <p className='subtitle'>Recherchez la crèche qui correspond à vos besoins</p>
                
                <form className='search-form' onSubmit={handleSearchSubmit}>
                    <div className='search-input-group'>
                        <FontAwesomeIcon icon={faSearch} className='search-icon' />
                        <input
                            type="search"
                            name="name"
                            placeholder='Rechercher par nom...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label='Rechercher une crèche'
                        />
                        <button type="submit" className='search-button'>
                            Rechercher
                        </button>
                    </div>
                </form>
            </div>

            <div className='filters-container'>
                <div className='results-count'>
                    {totalResults > 0 ? (
                        <span>{totalResults} {totalResults === 1 ? 'résultat' : 'résultats'} trouvés</span>
                    ) : (
                        <span>Aucun résultat</span>
                    )}
                </div>
                
                <div className='filter-group'>
                    <label htmlFor="location-filter" className='filter-label'>Filtrer par ville :</label>
                    <select
                        id="location-filter"
                        name="location-filter"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className='filter-select'
                    >
                        <option value="">Toutes les villes</option>
                        <option value="cotonou">Cotonou</option>
                        <option value="parakou">Parakou</option>
                        <option value="porto-novo">Porto-Novo</option>
                        <option value="abomey">Abomey</option>
                    </select>
                </div>
            </div>

            {loading && (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                    <p>Chargement en cours...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <p>Une erreur est survenue : {error}</p>
                    <button onClick={() => fetchCreches(searchTerm, page)} className='retry-button'>
                        Réessayer
                    </button>
                </div>
            )}

            {!loading && !error && (
                <>
                    {filteredCreches.length > 0 ? (
                        <div className='creches-grid'>
                            {filteredCreches.map(creche => (
                                <div className='creche-card' key={creche.id}>
                                    <Link to={`/crechedetails/${creche.id}`} className='creche-link'>
                                        <div className='creche-image-container'>
                                            <img
                                                src={creche.image || "/blanc.jpg"}
                                                alt={creche.name}
                                                className='creche-image'
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/blanc.jpg";
                                                }}
                                            />
                                            <div className='creche-overlay'></div>
                                        </div>
                                        <div className='creche-info'>
                                            <h3 className='creche-name'>{creche.name}</h3>
                                            <div className='creche-location'>
                                                <FontAwesomeIcon icon={faMapMarkerAlt} className='location-icon' />
                                                <span>{creche.address || "Adresse non disponible"}</span>
                                            </div>
                                            <div className='creche-cta'>
                                                Voir les détails
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>Aucune crèche ne correspond à votre recherche "{searchParams.get("name")}"</p>
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setLocationFilter('');
                                    setSearchParams({});
                                    fetchCreches();
                                }} 
                                className='reset-filters-button'
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    )}
                </>
            )}

            {totalResults > resultsPerPage && (
                <div className="pagination-container">
                    <button 
                        onClick={() => handlePageChange(page - 1)} 
                        disabled={page === 1}
                        className='pagination-button'
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        Précédent
                    </button>
                    
                    <div className='page-indicator'>
                        Page {page} sur {Math.ceil(totalResults / resultsPerPage)}
                    </div>
                    
                    <button 
                        onClick={() => handlePageChange(page + 1)} 
                        disabled={page >= Math.ceil(totalResults / resultsPerPage)}
                        className='pagination-button'
                    >
                        Suivant
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CrecheGarderie;