import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { usePokemonDetails } from '../hooks/api/usePokemonDetails';
import './DetailsPage.css';

function DetailsPage() {
  const { detailsId } = useParams<{ detailsId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: details, isLoading, error } = usePokemonDetails(detailsId);

  useEffect(() => {
    if (error) {
      navigate('/not-found', { replace: true });
    }
  }, [error, navigate]);

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

      {isLoading && <div className="details-loading">Loading...</div>}

      {details && !isLoading && (
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