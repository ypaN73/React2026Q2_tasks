import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import './DetailsPage.css';

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

function DetailsPage() {
  const { detailsId } = useParams<{ detailsId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!detailsId) return;

    const fetchDetails = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${detailsId}`
        );
        if (!response.ok) {
          navigate('/not-found', { replace: true });
          return;
        }
        const data: PokemonDetails = await response.json();
        setDetails(data);
      } catch {
        navigate('/not-found', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [detailsId, navigate]);

  const handleClose = () => {
    const page = searchParams.get('page') || '1';
    navigate(`/?page=${page}`);
  };

  if (!detailsId) {
    return null;
  }

  return (
    <div className="details-panel">
      <button className="details-close-btn" onClick={handleClose}>
        ✕
      </button>

      {loading && <div className="details-loading">Loading...</div>}

      {details && !loading && (
        <div>
          <h2 className="details-name">{details.name}</h2>
          {details.sprites.front_default && (
            <img
              src={details.sprites.front_default}
              alt={details.name}
              className="details-image"
            />
          )}
          <p className="details-info">
            <strong>Height:</strong> {details.height}
          </p>
          <p className="details-info">
            <strong>Weight:</strong> {details.weight}
          </p>
          <p className="details-info">
            <strong>Types:</strong>{' '}
            {details.types.map((t) => t.type.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

export default DetailsPage;