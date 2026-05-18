import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detailsId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${detailsId}`
        );
        if (!response.ok) {
          throw new Error('Failed to load details');
        }
        const data: PokemonDetails = await response.json();
        setDetails(data);
      } catch {
        setError('Failed to load Pokémon details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [detailsId]);

  const handleClose = () => {
    const page = searchParams.get('page') || '1';
    navigate(`/?page=${page}`);
  };

  if (!detailsId) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        maxWidth: '100%',
        height: '100vh',
        backgroundColor: '#fff',
        boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        overflowY: 'auto',
        zIndex: 100,
      }}
    >
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#6b7280',
        }}
      >
        ✕
      </button>

      {loading && <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>}

      {error && (
        <div style={{ color: '#ef4444', marginTop: '40px' }}>{error}</div>
      )}

      {details && !loading && (
        <div>
          <h2 style={{ textTransform: 'capitalize', marginBottom: '16px' }}>
            {details.name}
          </h2>
          {details.sprites.front_default && (
            <img
              src={details.sprites.front_default}
              alt={details.name}
              style={{
                width: '200px',
                height: '200px',
                display: 'block',
                margin: '0 auto 16px',
              }}
            />
          )}
          <p>
            <strong>Height:</strong> {details.height}
          </p>
          <p>
            <strong>Weight:</strong> {details.weight}
          </p>
          <p>
            <strong>Types:</strong>{' '}
            {details.types.map((t) => t.type.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

export default DetailsPage;